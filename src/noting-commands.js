/**
 * Noting commands
 *
 * Scribe noting commands.
 */


var notingApi = require('./noting-api');
var vdom = require('./noting-vdom');


/**
 * Initialise noting commands
 * @param  {Scribe} scribe
 * @param  {String} user  Current user string.
 */
exports.init = function(scribe, user) {

  // initialise current user for Noting API
  notingApi.user = user;


  scribe.commands.noteCollapseToggle = createCollapseToggleCommand(scribe);
  scribe.commands.noteCollapseToggleAll = createCollapseToggleAllCommand(scribe);

  addNoteCollapseListener(scribe);

  /**
  * The note command
  */

  var noteCommand = new scribe.api.Command('insertHTML');

  noteCommand.execute = function () {
    var selection = new scribe.api.Selection();

    // Place markers and create virtual trees.
    // We'll use the markers to determine where a selection starts and ends.
    selection.placeMarkers();

    vdom.mutate(scribe.el, function(treeFocus) {
      var scenarios = {
        caretWithinNote: function (treeFocus) { notingApi.unnote(treeFocus); },
        selectionWithinNote: function (treeFocus) {  notingApi.unnotePartOfNote(treeFocus);  },
        caretOutsideNote: function (treeFocus) { notingApi.createEmptyNoteAtCaret(treeFocus); },
        selectionOutsideNote: function (treeFocus) { notingApi.createNoteFromSelection(treeFocus); }
      };

      // Perform action depending on which state we're in.
      scenarios[noteCommand.queryState()](treeFocus);
    });

    // Place caret (necessary to do this explicitly for FF).
    selection.selectMarkers();

    // We need to make sure we clean up after ourselves by removing markers
    // when we're done, as our functions assume there's either one or two
    // markers present.
    selection.removeMarkers();
  };

  /*
    Example. We have two notes:
    <p>
      <gu:note>Some noted text</gu:note>| and some other text inbetween |<gu:note>More noted text</gu:note>
    </p>

    We press BACKSPACE, deleting the text, and end up with:
    <p>
      <gu:note data-note-edited-by="Edmond Dantès" data-note-edited-date="2014-09-15T16:49:20.012Z">Some noted text</gu:note><gu:note data-note-edited-by="Lord Wilmore" data-note-edited-date="2014-09-20T10:00:00.012Z">More noted text</gu:note>
    </p>

    This function will merge the notes:
    <p>
      <gu:note data-note-edited-by="The Count of Monte Cristo" data-note-edited-date="2014-10-10T17:00:00.012Z">Some noted text</gu:note><gu:note data-note-edited-by="The Count of Monte Cristo" data-note-edited-date="2014-10-10T17:00:00.012Z">More noted text</gu:note>
    </p>

    The last user to edit "wins", the rationale being that they have approved
    these notes by merging them. In this case all note segments are now
    listed as being edited by The Count of Monte Cristo and the timestamp
    shows the time when the notes were merged.
  */
  noteCommand.mergeIfNecessary = function () {
    function inconsistentTimestamps(note) {
      function getDataDate(noteSegment) {
        return noteSegment.vNode.properties.dataset[DATA_DATE_CAMEL];
      }

      var uniqVals = _(note).map(getDataDate).uniq().value();
      return uniqVals.length > 1;
    }

    vdom.mutate(scribe.el, function(treeFocus) {
      // Merging is simply a matter of updating the attributes of any notes
      // where all the segments of the note doesn't have the same timestamp.
      findAllNotes(treeFocus).filter(inconsistentTimestamps).forEach(updateNoteProperties);
    });
  };

  var NODE_NAME = 'GU:NOTE';

  /**
   * Noting: Operations on the real DOM
   */

  // Walk up the (real) DOM checking isTargetNode.
  function domWalkUpFind(node, isTargetNode) {
    if (! node.parentNode) return false;

    return isTargetNode(node) ? node : domWalkUpFind(node.parentNode, isTargetNode);
  }

  // Return the note our selection is inside of, if we are inside one.
  function domFindAncestorNote(node) {
    return domWalkUpFind(node, function(node) {
      return node.tagName === NODE_NAME;
    });
  }


  function domSelectionEntirelyWithinNote() {
    var selection = new scribe.api.Selection();
    var startNode = selection.selection.getRangeAt(0).startContainer;
    var endNode = selection.selection.getRangeAt(0).endContainer;

    return domFindAncestorNote(startNode) && domFindAncestorNote(endNode);
  }


  noteCommand.queryState = function () {
    var selection = new scribe.api.Selection();

    // TODO: Should return false when the start and end is within a note,
    // but where there is unnoted text inbetween.
    var withinNote = domSelectionEntirelyWithinNote();

    var state;
    if (selection.selection.isCollapsed && withinNote) {
      state = 'caretWithinNote';
    } else if (withinNote) {
      state = 'selectionWithinNote';
    } else if (selection.selection.isCollapsed) {
      state = 'caretOutsideNote';
    } else {
      state = 'selectionOutsideNote'; // at least partially outside.
    }

    return state;
  };

  scribe.commands.note = noteCommand;

  scribe.el.addEventListener('keydown', function (event) {
    var noteCommand = scribe.getCommand('note');

    var f8 = event.keyCode === 119;
    var f10 = event.keyCode === 121;
    var altDelete = event.altKey && event.keyCode === 46;

    if (f8 || f10 || altDelete) {
      event.preventDefault();
      noteCommand.execute();
    }
  });

  // The `input` event is fired when a `contenteditable` is changed.
  // Note that if we'd use `keydown` our function would run before
  // the change (as well as more than necessary).
  scribe.el.addEventListener('input', noteCommand.mergeIfNecessary, false);

};


function createCollapseToggleCommand(scribe) {
  var collapseCommand = new scribe.api.Command('insertHTML');

  // *** collapse toggle command ***
  collapseCommand.execute = function(value) {
    var selection = new scribe.api.Selection();

    // Place markers and create virtual trees.
    // We'll use the markers to determine where a selection starts and ends.
    selection.placeMarkers();

    notingApi.collapse.collapseToggleSelectedNote(scribe.el);

    // Place caret (necessary to do this explicitly for FF).
    selection.selectMarkers();

    // We need to make sure we clean up after ourselves by removing markers
    // when we're done, as our functions assume there's either one or two
    // markers present.
    selection.removeMarkers();
  };

  collapseCommand.queryState = function() {

  };

  return collapseCommand;
};


function createCollapseToggleAllCommand(scribe) {
  var collapseAllCommand = new scribe.api.Command('insertHTML');

  // *** toggle collapse all command ***
  collapseAllCommand.execute = function() {
    var state = !this._state;

    notingApi.collapse.collapseToggleAllNotes(scribe.el, state);

    this._state = state;
  };

  collapseAllCommand.queryEnabled = function() {
    // true when notes are on page
    return !!scribe.el.getElementsByTagName('gu:note').length;
  };

  collapseAllCommand.queryState = function() {
    return !!this._state;
  };

  return collapseAllCommand;

};


function addNoteCollapseListener(scribe) {
  scribe.el.addEventListener('click', function(event) {
    var target = event.target;

    if (target.nodeName == 'GU:NOTE') {

      var selection = new scribe.api.Selection();

      var range = document.createRange();
      range.selectNodeContents(target);

      selection.selection.removeAllRanges();
      selection.selection.addRange(range);

      scribe.getCommand('noteCollapseToggle').execute();
    }
  });
}

