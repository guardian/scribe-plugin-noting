var isVFocus = require('../../utils/vfocus/is-vfocus');
var config = require('../../config');
var errorHandle = require('../../utils/error-handle');
var findScribeMarkers = require('../../utils/noting/find-scribe-markers');
var findParentNoteSegment = require('../../utils/noting/find-parent-note-segment');
var findEntireNote = require('../../utils/noting/find-entire-note');
var removeScribeMarkers = require('./remove-scribe-markers');
var createVirtualScribeMarker = require('../../utils/create-virtual-scribe-marker');

module.exports = function selectNoteFromCaret(focus, tagName = config.get('defaultTagName')){
  if (!isVFocus(focus)){
    errorHandle('Only a valid VFocus element can be passed to selectNoteFromCaret, you passed: %s', focus);
  }

  var markers = findScribeMarkers(focus);
  if(!markers.length){
    return focus;
  }

  var parentNoteSegment = findParentNoteSegment(markers[0]);
  var note = findEntireNote(parentNoteSegment);
  removeScribeMarkers(focus);

  note[0].prependChildren(createVirtualScribeMarker());
  note.splice(-1)[0].addChild(createVirtualScribeMarker());
  return focus;
}
