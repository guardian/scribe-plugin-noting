/**
 * Noting commands
 *
 * Scribe noting commands.
 */

'use strict';

var noteToggle = require('./api/note-toggle');
var noteCollapse = require('./api/note-collapse');
var vdom = require('./noting-vdom');


/**
 * Initialise noting commands
 * @param  {Scribe} scribe
 * @param  {String} user  Current user string.
 */
exports.init = function(scribe, user) {

  // initialise current user for Noting API
  noteToggle.user = user;

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
    var state = !this._state;

    vdom.mutate(scribe.el, function(treeFocus) {
      noteCollapse.collapseToggleAllNotes(treeFocus, state);
    });

    this._state = state;
  };

  collapseAllCommand.queryEnabled = function() {
    // true when notes are on page
    return !!scribe.el.getElementsByTagName('gu-note').length;
  };

  collapseAllCommand.queryState = function() {
    return this.queryEnabled() && !!this._state;
  };

  return collapseAllCommand;

}


function addNoteToggleListener(scribe) {
  scribe.el.addEventListener('keydown', function (event) {
    var f8 = event.keyCode === 119;
    var f10 = event.keyCode === 121;
    var altDelete = event.altKey && event.keyCode === 46;

    if (f8 || f10 || altDelete) {
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
  scribe.el.addEventListener('input', function() {

    vdom.mutateScribe(scribe, function(treeFocus) {
      noteToggle.ensureNoteIntegrity(treeFocus);
    });

  });
}
