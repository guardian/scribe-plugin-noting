/**
 * Noting API
 *
 * Perform noting actions on a Virtual DOM
 */
'use strict';

exports.user = 'unknown';

var h = require('virtual-hyperscript');
var _ = require('lodash');

var isVText = require('vtree/is-vtext');
var VText = require('vtree/vtext');

var NODE_NAME = 'GU-NOTE';
var TAG = 'gu-note';
var CLASS_NAME = 'note';
var DATA_NAME = 'data-note-edited-by';
var DATA_NAME_CAMEL = 'noteEditedBy';
var DATA_DATE = 'data-note-edited-date';
var DATA_DATE_CAMEL = 'noteEditedDate';
var NOTE_BARRIER_TAG = 'gu-note-barrier';

var vdom = require('./note-vdom');
var getEditedByTitleText = require('../utils/get-uk-date');
var wrapInNote = require('../actions/noting/wrap-in-note');
var unwrap = require('../actions/noting/unwrap-note');
var addUniqueVNodeClass = require('../actions/vdom/add-class');
var removeVNodeClass = require('../actions/vdom/remove-class');
var generateUUID = require('../utils/generate-uuid');


// Ensure the first (and only the first) note segment has a
// `note--start` class and that the last (and only the last)
// note segment has a `note--end` class.
var updateNoteProperties = require('../actions/noting/reset-note-segment-classes');
var userAndTimeAsDatasetAttrs = require('../utils/get-note-data-attrs');
var createVirtualScribeMarker = require('../utils/create-virtual-scribe-marker');
var createNoteBarrier = require('../utils/create-note-barrier');
var updateNoteBarriers = require('../actions/noting/reset-note-barriers');
var createEmptyNoteAtCaret = require('../actions/noting/create-note-at-caret');
var preventBrTags = require('../actions/noting/remove-erroneous-br-tags');
var createNoteFromSelection = require('../actions/noting/create-note-from-selection');

// treeFocus: tree focus of tree containing two scribe markers
// Note that we will mutate the tree.
function unnote(treeFocus) {
  // We assume the caller knows there's only one marker.
  var marker = vdom.findMarkers(treeFocus)[0];
  // We can't use findEntireNote here since it'll sometimes give us the wrong result.
  // See `findEntireNote` documentation. Instead we look the note up by its ID.
  vdom.updateNotesCache(treeFocus);
  var noteSegment = vdom.findAncestorNoteSegment(marker);
  var noteSegments = vdom.findNote(treeFocus, noteSegment.vNode.properties.dataset.noteId);

  noteSegments.forEach(unwrap);

  exports.ensureNoteIntegrity(treeFocus);

  // The marker is where we want it to be (the same position) so we'll
  // just leave it.
}


/*
Unnote part of note, splitting the rest of the original note into new notes.

Example
-------
Text within a note has been selected:

  <p>Asked me questions about the vessel<gu-note>|, the time she left Marseilles|, the
  course she had taken,</gu-note> and what was her cargo. I believe, if she had not
  been laden, and I had been her master, he would have bought her.</p>


We find the entire note and, within the note, we note everything _but_ what we want to unnote:

  <p>Asked me questions about the vessel<gu-note>, the time she left Marseilles<gu-note>, the
  course she had taken,</gu-note></gu-note> and what was her cargo. I believe, if she had not
  been laden, and I had been her master, he would have bought her.</p>


Then we unwrap the previously existing note. The text we selected has been unnoted:

  <p>Asked me questions about the vessel, the time she left Marseilles<gu-note>, the
  course she had taken,</gu-note> and what was her cargo. I believe, if she had not
  been laden, and I had been her master, he would have bought her.</p>

*/
function unnotePartOfNote(treeFocus) {
  function notToBeUnnoted(focus) {
    var candidateVTextNode = focus.vNode;
    return textNodesToUnnote.indexOf(candidateVTextNode) === -1;
  }

  var focusesToUnnote = vdom.findTextNodeFocusesBetweenMarkers(treeFocus);
  var entireNote = vdom.findEntireNote(focusesToUnnote[0]);


  var entireNoteTextNodeFocuses = _(entireNote).map(vdom.focusAndDescendants)
    .flatten().value().filter(vdom.focusOnTextNode);

  var entireNoteTextNodes = entireNoteTextNodeFocuses.map(function(focus) {
    return focus.vNode;
  });


  var textNodesToUnnote = focusesToUnnote.map(function(focus) {
    return focus.vNode;
  });
  var toWrapAndReplace = _.difference(entireNoteTextNodes, textNodesToUnnote);


  var focusesToNote = entireNoteTextNodeFocuses.filter(notToBeUnnoted);
  var userAndTime = userAndTimeAsDatasetAttrs();


  // Wrap the text nodes.
  var wrappedTextNodes = toWrapAndReplace.map(function(vNode) {
    return wrapInNote(vNode, userAndTime);
  });

  // Replace the nodes in the tree with the wrapped versions.
  _.zip(focusesToNote, wrappedTextNodes).forEach(function(focusAndReplacementVNode) {
    var focus = focusAndReplacementVNode[0];
    var replacementVNode = focusAndReplacementVNode[1];

    focus.replace(replacementVNode);
  });

  // Unwrap previously existing note.
  entireNote.forEach(unwrap);


  // Unless the user selected the entire note contents, notes to the left
  // and/or right of the selection will have been created. We need to update
  // their attributes and CSS classes.
  var onlyPartOfContentsSelected = focusesToNote[0];


  if (onlyPartOfContentsSelected) {
    var tf = focusesToNote[0].top();
    exports.ensureNoteIntegrity(tf);
  }

  // Place marker immediately before the note to the right (this way of doing
  // that seems to be the most reliable for some reason). Both Chrome and
  // Firefox have issues with this however. To force them to behave we insert
  // an empty span element inbetween.
  var markers = vdom.findMarkers(treeFocus.refresh());
  _.last(markers).insertAfter(new VText('\u200B'));
  markers[0].remove();


  // If the user selected everything but a space (or zero width space), we remove
  // the remaining note. Most likely that's what our user intended.
  vdom.removeEmptyNotes(treeFocus.refresh());

}


/*
  Example. We have two notes:
  <p>
    <gu-note>Some noted text</gu-note>| and some other text inbetween |<gu-note>More noted text</gu-note>
  </p>

  We press BACKSPACE, deleting the text, and end up with:
  <p>
    <gu-note data-note-edited-by="Edmond Dantès" data-note-edited-date="2014-09-15T16:49:20.012Z">Some noted text</gu-note><gu-note data-note-edited-by="Lord Wilmore" data-note-edited-date="2014-09-20T10:00:00.012Z">More noted text</gu-note>
  </p>

  This function will merge the notes:
  <p>
    <gu-note data-note-edited-by="The Count of Monte Cristo" data-note-edited-date="2014-10-10T17:00:00.012Z">Some noted text</gu-note><gu-note data-note-edited-by="The Count of Monte Cristo" data-note-edited-date="2014-10-10T17:00:00.012Z">More noted text</gu-note>
  </p>

  The last user to edit "wins", the rationale being that they have approved
  these notes by merging them. In this case all note segments are now
  listed as being edited by The Count of Monte Cristo and the timestamp
  shows the time when the notes were merged.
 */

var  mergeIfNecessary = require('../actions/noting/merge-if-necessary');
var ensureNoteIntegrity = exports.ensureNoteIntegrity = require('../actions/noting/ensure-note-integrity');

exports.toggleNoteAtSelection = function toggleNoteAtSelection(treeFocus, selection) {
  function state() {
    var selectionMarkers = vdom.findMarkers(treeFocus);
    var selectionIsCollapsed = selectionMarkers.length === 1;
    var withinNote = vdom.selectionEntirelyWithinNote(selectionMarkers);

    var state;
    if (selectionIsCollapsed && withinNote) {
      state = 'caretWithinNote';
    } else if (withinNote) {
      state = 'selectionWithinNote';
    } else if (selectionIsCollapsed) {
      state = 'caretOutsideNote';
    } else {
      state = 'selectionOutsideNote'; // at least partially outside.
    }

    return state;
  }

  var scenarios = {
    caretWithinNote: function(treeFocus) {
      unnote(treeFocus);
    },
    selectionWithinNote: function(treeFocus) {
      unnotePartOfNote(treeFocus);
    },
    caretOutsideNote: function(treeFocus) {
      createEmptyNoteAtCaret(treeFocus);
    },
    selectionOutsideNote: function(treeFocus) {
      createNoteFromSelection(treeFocus);
    }
  };

  // Perform action depending on which state we're in.
  scenarios[state()](treeFocus);
};

// TODO: Replace with `selectionEntirelyWithinNote`.
exports.isSelectionInANote = function isSelectionInANote(selectionRange, parentContainer) {

  // Walk up the (real) DOM checking isTargetNode.
  function domWalkUpFind(node, isTargetNode) {
    if (!node.parentNode || node === parentContainer) {
      return false;
    }

    return isTargetNode(node) ? node : domWalkUpFind(node.parentNode, isTargetNode);
  }

  // Return the note our selection is inside of, if we are inside one.
  function domFindAncestorNote(node) {
    return domWalkUpFind(node, function(node) {
      return node.tagName === NODE_NAME;
    });
  }

  return domFindAncestorNote(selectionRange.startContainer) && domFindAncestorNote(selectionRange.endContainer) && true;
};
