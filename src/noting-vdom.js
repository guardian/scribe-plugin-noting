/**
 * Virtual DOM parser / serializer for Noting plugin.
 */

var TAG = 'gu:note';

var _ = require('lodash');

var diff = require('virtual-dom/diff');
var patch = require('virtual-dom/patch');

// There was a bug in vdom-virtualize that caused data attributes not
// to be virtualized. Have fixed this and got it merged upstream.
// No new release yet, however, so have specified the specific commit as
// dependency. Feel free to update to future versions when they're released.
var virtualize = require('vdom-virtualize');

var isVText = require('vtree/is-vtext');

var VFocus = require('./vfocus');


/**
 * Virtualises a DOMElement to a callback for mutation.
 * @param  {DOMElement}   domElement
 * @param  {Function} callback
 */
exports.mutate = function(domElement, callback) {

  var originalTree = virtualize(domElement);
  var tree = virtualize(domElement); // we'll mutate this one
  var treeFocus = new VFocus(tree);

  callback(treeFocus);

  // Then diff with the original tree and patch the DOM.
  var patches = diff(originalTree, tree);
  patch(domElement, patches);

};


/**
* Noting: Checks
*/

function focusOnMarker(focus) {
  return isScribeMarker(focus.vNode);
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

function focusOnEmptyTextNode(focus) {
  // We consider zero width spaces as empty.
  function consideredEmpty(s) {
    return s === '' || s === '\u200B';
  }
  var vNode = focus.vNode;

  var result = isVText(vNode) && consideredEmpty(vNode.text);
  return isVText(vNode) && consideredEmpty(vNode.text);
}

// Whether a DOM node or vNode is a note.
// Case insensitive to work with both DOM nodes and vNodes
// (which can be lowercase).
function isNote(node) {
  return node.tagName && node.tagName.toLowerCase() === TAG;
}

function isScribeMarker(vNode) {
   return hasClass(vNode, 'scribe-marker');
}

// Check if VNode has class
function hasClass(vNode, value) {
  return (vNode.properties && vNode.properties.className === value);
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
  function focusNotOnMarker(focus) {
    return ! focusOnMarker(focus);
  }

  return focusOnlyTextNodes(
    treeFocus.find(focusOnMarker).next().takeWhile(focusNotOnMarker)
  );
}

function findMarkers(treeFocus) {
  return treeFocus.filter(focusOnMarker);
}

function findFirstNoteSegment(fNoteSegment) {
  return _.last(
    fNoteSegment.takeWhile(stillWithinNote, 'prev').filter(focusOnNote)
  );
}

function findLastNoteSegment(fNoteSegment) {
  return _.last(
    fNoteSegment.takeWhile(stillWithinNote).filter(focusOnNote)
  );
}

// Find the rest of a note.
// We identify notes based on 'adjacency' rather than giving them an id.
// This is because people may press RETURN or copy and paste part of a note.
// In such cases we don't want that to keep being the same note.
// noteSegment: focus on note
function findEntireNote(noteSegment) {
  return findFirstNoteSegment(noteSegment)
    .takeWhile(stillWithinNote).filter(focusOnNote);
}

function findEntireNoteTextNodeFocuses(noteSegment) {
  return findFirstNoteSegment(noteSegment).takeWhile(stillWithinNote).filter(focusOnTextNode).filter(function (focus) { return ! focusOnEmptyTextNode(focus); });
}

// Regurns an array of arrays of note segments
exports.findAllNotes = function findAllNotes(focus) {
  var treeFocus = focus.top();

  var notes = [];

  focus = treeFocus;
  var firstNoteSegment;
  while (firstNoteSegment = focus.find(focusOnNote)) {
    var note = findEntireNote(firstNoteSegment);
    notes.push(note);

    focus = note[note.length - 1].next();
  }
  return notes;
};

function focusOnlyTextNodes (focuses) {
  return focuses.filter(focusOnTextNode);
}



exports.findSelectedNote = function findSelectedNote(treeFocus) {
  var note = findAncestorNoteSegment(findMarkers(treeFocus)[0]);

  return note && findEntireNote(note) || undefined;
};
