var isScribeMarker = require('../../utils/noting/is-scribe-marker');
var findPreviousNoteSegment = require('../../utils/noting/find-previous-note-segment');
var findNextNoteSegment = require('../../utils/noting/find-next-note-segment');
var removeScribeMarkers = require('./remove-scribe-markers');
var createVirtualScribeMarker = require('../../utils/create-virtual-scribe-marker');
var createNoteFromSelection = require('./create-note-from-selection');

var notingVDom = require('../../noting-vdom');
var mutate = notingVDom.mutate;
var mutateScribe = notingVDom.mutateScribe;

// Function to handle the case of pasting inside a note. Without these steps,
// we would end up with the pasted content surrounded by two separate notes.
// It finds the marker (current cursor position), the previous and next notes
// (the ones we need to sew together) and wraps them into a new note.
module.exports = function wrapInNoteAroundPaste(focus) {
  var marker = focus.find(isScribeMarker)

  var node = marker.find(focus => {
    if(!focus.vNode.tagName) {
      return false
    }

    let tagName = focus.vNode.tagName.toLowerCase()
    return (tagName == "gu-note" || tagName == "gu-correct" || tagName == "gu-flag")
  }, 'left')

  if (!node) {
    return
  }

  var tagName = node.vNode.tagName.toLowerCase()

  var prevNote = findPreviousNoteSegment(marker, tagName)
  var nextNote = findNextNoteSegment(marker, tagName)

  if (!prevNote || !nextNote) {
    return
  }

  removeScribeMarkers(focus)

  prevNote.prependChildren(createVirtualScribeMarker())
  nextNote.addChild(createVirtualScribeMarker())

  createNoteFromSelection(focus, tagName, true)
}
