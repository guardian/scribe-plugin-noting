var isVFocus = require('../../utils/vfocus/is-vfocus');
var getNoteDataAttributes = require('../../utils/get-note-data-attrs');

var createVirtualScribeMarker = require('../../utils/create-virtual-scribe-marker');
var wrapInNote = require('./wrap-in-note');


var findScribeMarkers = require('../../utils/noting/find-scribe-markers');
var findEntireNote = require('../../utils/noting/find-entire-note');

var resetNoteSegmentClasses = require('./reset-note-segment-classes');

// We need a zero width space character to make the note selectable.
var zeroWidthSpace = '\u200B';

module.exports = function createNoteAtCaret(focus) {

  if (!isVFocus(focus)) {
    throw new Error('Only a valid VFocus can be passed to createNoteAtCaret');
  }

  // To make sure the caret is placed within the note we place a scribe
  // maker within it.
  // Chrome is picky about needing the space to be before the marker
  // (otherwise the caret won't be placed within the note).
  var note = wrapInNote([zeroWidthSpace, createVirtualScribeMarker()], getNoteDataAttributes());

  var marker = findScribeMarkers(focus)[0];
  if (!marker) {
    return focus;
  }

  //inject the note
  marker.replace(note);

  //get any adjoining note segments
  var noteSegments = findEntireNote(marker);
  resetNoteSegmentClasses(noteSegments);

  return focus;

};
