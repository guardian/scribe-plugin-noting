/**
 * Noting commands
 *
 * Scribe noting commands.
 */

'use strict';

var noteToggle = require('./api/note-toggle');
var noteCollapse = require('./api/note-collapse');
var vdom = require('./noting-vdom');
var _ = require('lodash');


/**
 * Initialise noting commands
 * @param  {Scribe} scribe
 * @param  {String} user  Current user string.
 */
exports.init = function(scribe, config) {
  // initialise current user for Noting API
  noteToggle.user = config.user;

  // initialise scribe element selector
  // TODO: Extract the configuration varialbles into its own module.
  noteCollapse.scribeInstancesSelector = config.scribeInstancesSelector;

  scribe.commands.note = createNoteToggleCommand(scribe);
  scribe.commands.noteCollapseToggle = createCollapseToggleCommand(scribe);
  scribe.commands.noteCollapseToggleAll = createCollapseToggleAllCommand(scribe);

  addNoteToggleListener(scribe);
  addNoteCollapseListener(scribe);

  addContentChangedListener(scribe);
};


function createNoteToggleCommand(scribe) {
  var noteCommand = new scribe.api.Command('insertHTML');

  noteCommand.execute = function() {

    vdom.mutateScribe(scribe, function(treeFocus, selection) {
      noteToggle.toggleNoteAtSelection(treeFocus, selection);
    });

  };

  noteCommand.queryState = function() {
    var selection = new scribe.api.Selection();

    return noteToggle.isSelectionInANote(selection.range, scribe.el);
  };

  noteCommand.queryEnabled = function() {
    return true;
  };

  return noteCommand;
}




function createCollapseToggleCommand(scribe) {
  var collapseCommand = new scribe.api.Command('insertHTML');

  // *** collapse toggle command ***
  collapseCommand.execute = function(value) {

    vdom.mutateScribe(scribe, function(treeFocus) {
      noteCollapse.collapseToggleSelectedNote(treeFocus);
    });

  };

  collapseCommand.queryState = function() {

  };

  return collapseCommand;
}


function createCollapseToggleAllCommand(scribe) {
  var collapseAllCommand = new scribe.api.Command('insertHTML');

  // *** toggle collapse all command ***
  collapseAllCommand.execute = function() {
    // This command is a bit special in the sense that it will operate on all
    // Scribe instances on the page.
    //
    // We use a global variable to keep track of the state since we need this
    // to be available to all Scribe instances. Otherwise the state in different
    // instances can get out of sync.
    var state = !window._scribe_plugin_noting__noteCollapsedState,
        scribeInstances = _.toArray(document.querySelectorAll(noteCollapse.scribeInstancesSelector));

    scribeInstances.forEach(function (instance) {

      vdom.mutate(instance, function(treeFocus) {
        noteCollapse.collapseToggleAllNotes(treeFocus, state);
      });

    });

    window._scribe_plugin_noting__noteCollapsedState = state;
  };

  collapseAllCommand.queryEnabled = function() {
    // true when notes are on page
    return !!scribe.el.getElementsByTagName('gu-note').length;
  };

  collapseAllCommand.queryState = function() {
    return this.queryEnabled() && !!window._scribe_plugin_noting__noteCollapsedState;
  };

  return collapseAllCommand;

}


function addNoteToggleListener(scribe) {
  scribe.el.addEventListener('keydown', function (event) {
    var f8 = event.keyCode === 119;
    var f10 = event.keyCode === 121;
    var altBackspace = event.altKey && event.keyCode === 8;

    if (f8 || f10 || altBackspace) {
      event.preventDefault();
      scribe.getCommand('note').execute();
    }
  });
}


function addNoteCollapseListener(scribe) {
  scribe.el.addEventListener('click', function(event) {
    var target = event.target;

    if (target.nodeName == 'GU-NOTE') {

      var selection = new scribe.api.Selection();

      var range = document.createRange();
      range.selectNodeContents(target);

      selection.selection.removeAllRanges();
      selection.selection.addRange(range);

      scribe.getCommand('noteCollapseToggle').execute();
    }
  });
}


function addContentChangedListener(scribe) {
    function mutateScribe() {
        vdom.mutateScribe(scribe, function(treeFocus) {
            noteToggle.ensureNoteIntegrity(treeFocus);
        });
    }

    var throttled = _.throttle(mutateScribe, 2000);

    scribe.el.addEventListener('input', throttled);
}
