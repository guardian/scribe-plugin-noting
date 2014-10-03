/**
 * Shared note vdom functions.
 */

'use strict';

var isVText = require('vtree/is-vtext');

var NODE_NAME = 'GU-NOTE';
var TAG = 'gu-note';
var NOTE_BARRIER_TAG = 'gu-note-barrier';
var _ = require('lodash');

/**
* Noting: Checks
*/

function focusOnMarker(focus) {
  return isScribeMarker(focus.vNode);
}

function focusNotOnMarker(focus) {
  return ! focusOnMarker(focus);
}

function focusOnTextNode (focus) {
  return focus.vNode.type === 'VirtualText';
}

function focusOnNote(focus) {
  return isNote(focus.vNode);
}

function focusOutsideNote(focus) {
  return ! findAncestorNoteSegment(focus);
}


function consideredEmpty(s) {
  var zeroWidthSpace = '\u200B';
  var nonBreakingSpace = '\u00a0';

  // We incude regular spaces because if we have a note tag that only
  // includes a a regular space, then the browser will also insert a <BR>.
  // If we consider a string containing only a regular space as empty we
  // can remove the note tag to avoid the line break.
  //
  // Not ideal since it causes the space to be deleted even though the user
  // hasn't asked for that. We compensate for this by moving any deleted
  // space to the previous note segment.
  var regularSpace = ' ';

  return s === '' || s === zeroWidthSpace || s === nonBreakingSpace || s === regularSpace;
}

function focusOnEmptyTextNode(focus) {
  var vNode = focus.vNode;
  return isVText(vNode) && consideredEmpty(vNode.text);
}

function focusOnNoteBarrier(focus) {
  return isNoteBarrier(focus.vNode);
}

// Whether a DOM node or vNode is a note.
// Case insensitive to work with both DOM nodes and vNodes
// (which can be lowercase).
function isNote(node) {
  return node.tagName && node.tagName.toLowerCase() === TAG;
}

function isNoteBarrier(node) {
  return node.tagName && node.tagName.toLowerCase() === NOTE_BARRIER_TAG;
}

function isScribeMarker(vNode) {
  return hasClass(vNode, 'scribe-marker');
};

// Check if VNode has class
function hasClass(vNode, value) {
  return (vNode.properties && vNode.properties.className === value);
}

function stillWithinNote(focus) {
  return !focusOnTextNode(focus) || focusOnEmptyTextNode(focus) || focusOnNoteBarrier(focus) || findAncestorNoteSegment(focus);
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
  function insideTag(insideOfFocus) {
    return !!insideOfFocus.find(function (f) { return f.vNode === focus.vNode; }, 'up');
  }
  return focus.takeWhile(insideTag);
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
// noteSegment: focus on note
function findEntireNote(noteSegment) {
  return findFirstNoteSegment(noteSegment)
    .takeWhile(stillWithinNote).filter(focusOnNote);
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


// Export the following functions
//   TODO: streamline these so that dependant modules use more generic functions
exports.focusAndDescendants = focusAndDescendants;
exports.focusOnMarker = focusOnMarker;
exports.focusOnNote = focusOnNote;
exports.focusOnNoteBarrier = focusOnNoteBarrier;
exports.focusOnTextNode = focusOnTextNode;
exports.withoutText = withoutText;
exports.withEmptyTextNode = withEmptyTextNode;
exports.findLastNoteSegment = findLastNoteSegment;
exports.focusOutsideNote = focusOutsideNote;
exports.findSelectedNote = findSelectedNote;
exports.findAllNotes = findAllNotes;
exports.findEntireNote = findEntireNote;
exports.findFirstNoteSegment = findFirstNoteSegment;
exports.findMarkers = findMarkers;
exports.isScribeMarker = isScribeMarker;
exports.findAncestorNoteSegment = findAncestorNoteSegment;
exports.findTextNodeFocusesBetweenMarkers = findTextNodeFocusesBetweenMarkers;
exports.removeVirtualScribeMarkers = removeVirtualScribeMarkers;
exports.selectionEntirelyWithinNote = selectionEntirelyWithinNote;
