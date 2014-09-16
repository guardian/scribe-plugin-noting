/**
 * Noting commands
 *
 * Scribe noting commands.
 */


var notingApi = require('./noting-api');

var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');

// There was a bug in vdom-virtualize that caused data attributes not
// to be virtualized. Have fixed this and got it merged upstream.
// No new release yet, however, so have specified the specific commit as
// dependency. Feel free to update to future versions when they're released.
var virtualize = require('vdom-virtualize');

var VFocus = require('../vfocus');

module.exports = function(scribe) {

  /**
  * The note command
  */

  var noteCommand = new scribe.api.Command('insertHTML');

  noteCommand.execute = function () {
    var selection = new scribe.api.Selection();

    // Place markers and create virtual trees.
    // We'll use the markers to determine where a selection starts and ends.
    selection.placeMarkers();

    var originalTree = virtualize(scribe.el);
    var tree = virtualize(scribe.el); // we'll mutate this one
    var treeFocus = new VFocus(tree);

    var scenarios = {
      caretWithinNote: function (treeFocus) { notingApi.unnote(treeFocus); },
      selectionWithinNote: function (treeFocus) {  notingApi.unnotePartOfNote(treeFocus);  },
      caretOutsideNote: function (treeFocus) { notingApi.createEmptyNoteAtCaret(treeFocus); },
      selectionOutsideNote: function (treeFocus) { notingApi.createNoteFromSelection(treeFocus); }
    };

    // Perform action depending on which state we're in.
    scenarios[noteCommand.queryState()](treeFocus);

    // Then diff with the original tree and patch the DOM.
    var patches = diff(originalTree, tree);
    patch(scribe.el, patches);

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

    var originalTree = virtualize(scribe.el);
    var tree = virtualize(scribe.el); // we'll mutate this one
    var treeFocus = new VFocus(tree);

    // Merging is simply a matter of updating the attributes of any notes
    // where all the segments of the note doesn't have the same timestamp.
    findAllNotes(treeFocus).filter(inconsistentTimestamps).forEach(updateNoteProperties);

    // Then diff with the original tree and patch the DOM.
    var patches = diff(originalTree, tree);
    patch(scribe.el, patches);
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
