/**
 * Shared note vdom functions.
 */

'use strict';
//const
var NODE_NAME = 'GU-NOTE';
var TAG = 'gu-note';
var NOTE_BARRIER_TAG = 'gu-note-barrier';


var _ = require('lodash');
var isVText = require('vtree/is-vtext');

var hasClass = require('../utils/vdom/has-class');
var hasAttribute = require('../utils/vdom/has-attribute');
var isTag = require('../utils/vdom/is-tag');
var isEmpty = require('../utils/vdom/is-empty');

/**
* Noting: Checks
*/


//Detection

//is our selection a note
function focusOnNote(focus) {
  return isTag(focus.vNode, TAG);
}

// is our selection not a note
function focusOnMarker(focus) {
  return hasClass(focus.vNode, 'scribe-marker');
}

//is our selection a marker
function focusNotOnMarker(focus) {
  return !hasClass(focus.vNode, 'scribe-marker');
}


function focusOnTextNode (focus) {
  console.log(focus.vNode, focus.vNode.tagName);
  return isVText(focus.vNode);
}

function focusOnEmptyTextNode(focus) {
  return isEmpty(focus.vNode);
}

function focusOnParagraph(focus) {
  return isTag(focus.vNode, 'p');
}




function focusOutsideNote(focus) {
  return ! findAncestorNoteSegment(focus);
}

function focusOnNonEmptyTextNode(focus) {
  return focusOnTextNode(focus) && !focusOnEmptyTextNode(focus);
}

function hasNoteId(vNode, value) {
  return hasAttribute(vNode, 'data-node-id', value);
}

function stillWithinNote(focus) {
  return !focusOnTextNode(focus) || focusOnEmptyTextNode(focus) || findAncestorNoteSegment(focus);
}


/**
* Noting: Finders and filters
*/

function findAncestorNoteSegment(focus) {
  return focus.find(focusOnNote, 'up');
}

function findTextNodeFocusesBetweenMarkers(treeFocus) {
  return focusOnlyTextNodes(
    treeFocus.find(focusOnMarker).next().takeWhile(focusNotOnMarker)
  );
}

function findMarkers(treeFocus) {
  return treeFocus.filter(focusOnMarker);
}

function findFirstNoteSegment(noteSegment) {
  return _.last(
    noteSegment.takeWhile(stillWithinNote, 'prev').filter(focusOnNote)
  );
}

function findLastNoteSegment(noteSegment) {
  return _.last(
    noteSegment.takeWhile(stillWithinNote).filter(focusOnNote)
  );
}


function focusAndDescendants(focus) {
  // TODO: Use a proper algorithm for this.
  return focus.takeWhile(function(insideOfFocus) {
    return !!insideOfFocus.find(function (f) { return f.vNode === focus.vNode; }, 'up');
  });
}

function withoutText(focus) {
  return focusAndDescendants(focus).filter(focusOnTextNode).length === 0;
}

function withEmptyTextNode(focus) {
  return focusAndDescendants(focus).filter(focusOnTextNode).every(focusOnEmptyTextNode);
}

// Find the rest of a note.
// We identify notes based on 'adjacency' rather than giving them an id.
// This is because people may press RETURN or copy and paste part of a note.
// In such cases we don't want that to keep being the same note.
//
// This has a caveat when:
// 1. A note covers 3 paragraphs.
// 2. Part of a note in paragraph 2 is unnoted.
// 3. The caret is placed in paragraph 3.
// 4. The noting key is pressed.
// findFirstNoteSegment will then move backwards over a P
// and into the first note. We will then unnote the first
// note rather than the second.
//
// noteSegment: focus on note
function findEntireNote(noteSegment) {
  return findFirstNoteSegment(noteSegment)
    .takeWhile(stillWithinNote).filter(focusOnNote);
};

// Find a note based on its ID. Will not always give the same result as `findEntireNote` ,
// since that'll recognize that a note is adjacent to another one. But when a note
// covers several paragraphs we can't be sure findEntireNote
// will give us the right result (see comment for findEntireNote).
//
// TODO: Redo findEntireNote to be based on findNote and IDs? Could perhaps
// find adjacent notes with the help of focus.prev() and focus.next().
function findNote(treeFocus, noteId) {
  var allNoteSegments = _.flatten(findAllNotes(treeFocus));

  return allNoteSegments.filter(function (segment) {
    return hasNoteId(segment.vNode, noteId);
  });
};

// Returns an array of arrays of note segments
function findAllNotes(treeFocus) {
  return treeFocus.filter(focusOnNote).map(findEntireNote).reduce(function(uniqueNotes, note) {
    // First iteration: Add the note.
    if (uniqueNotes.length === 0) return uniqueNotes.concat([note]);

    // Subsequent iterations: Add the note if it hasn't already been added.
    return _.last(uniqueNotes)[0].vNode === note[0].vNode ? uniqueNotes : uniqueNotes.concat([note]);
  }, []);
}

function focusOnlyTextNodes (focuses) {
  return focuses.filter(focusOnTextNode);
}


function findSelectedNote(treeFocus) {
  var note = findAncestorNoteSegment(findMarkers(treeFocus)[0]);

  return note && findEntireNote(note) || undefined;
};


function selectionEntirelyWithinNote(markers) {
  if (markers.length === 2) {
    // We need the focusOnTextNode filter so we don't include P tags that
    // contains notes for example.
    var betweenMarkers = markers[0].next().takeWhile(focusNotOnMarker)
      .filter(focusOnTextNode);

    return betweenMarkers.every(findAncestorNoteSegment);
  } else {
    return !!findAncestorNoteSegment(markers[0]);
  }
}


/**
* Noting: Various
*/

function removeVirtualScribeMarkers(treeFocus) {
  treeFocus.filter(focusOnMarker).forEach(function (marker) {
    marker.remove();
  });
}

function removeEmptyNotes(treeFocus) {
  var allNoteSegments = _.flatten(findAllNotes(treeFocus));
  var noteSegmentsWithDescendants = allNoteSegments.map(focusAndDescendants);

  noteSegmentsWithDescendants.forEach(function (segmentWithDescendants) {
    var segment = segmentWithDescendants[0];
    var descendants = _.rest(segmentWithDescendants);

    var hasOnlyEmptyTextNodes = descendants.filter(focusOnTextNode)
      .every(focusOnEmptyTextNode);

    if (segment.vNode.children.length === 0 || hasOnlyEmptyTextNodes) {
      segment.remove();
    }
  });
}


// Export the following functions
//   TODO: streamline these so that dependant modules use more generic functions
exports.focusAndDescendants = focusAndDescendants;
exports.focusOnEmptyTextNode = focusOnEmptyTextNode;
exports.focusOnNonEmptyTextNode = focusOnNonEmptyTextNode;
exports.focusOnMarker = focusOnMarker;
exports.focusOnNote = focusOnNote;
exports.focusOnParagraph = focusOnParagraph;
exports.focusOnTextNode = focusOnTextNode;
exports.withoutText = withoutText;
exports.withEmptyTextNode = withEmptyTextNode;
exports.findLastNoteSegment = findLastNoteSegment;
exports.focusOutsideNote = focusOutsideNote;
exports.findSelectedNote = findSelectedNote;
exports.findAllNotes = findAllNotes;
exports.findEntireNote = findEntireNote;
exports.findNote = findNote;
exports.findFirstNoteSegment = findFirstNoteSegment;
exports.findMarkers = findMarkers;
exports.findAncestorNoteSegment = findAncestorNoteSegment;
exports.findTextNodeFocusesBetweenMarkers = findTextNodeFocusesBetweenMarkers;
exports.removeEmptyNotes = removeEmptyNotes;
exports.removeVirtualScribeMarkers = removeVirtualScribeMarkers;
exports.selectionEntirelyWithinNote = selectionEntirelyWithinNote;
