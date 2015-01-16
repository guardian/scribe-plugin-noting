var isVFocus = require('../vfocus/is-vfocus');
var VFocus = require('../../vfocus');
var findScribeMarkers = require('./find-scribe-markers');
var findParentNoteSegment = require('./find-parent-note-segment');
var findEntireNote = require('./find-entire-note');
var errorHandle = require('../error-handle');
var config = require('../../config');

module.exports = function findSelectedNote(focus, tagName = config.get('defaultTagName')) {

  if (!isVFocus(focus)) {
    errorHandle('Only a valid VFocus can be passed to findselectedNote, you passed: %s', focus);
  }

  var markers = findScribeMarkers(focus);
  if (markers.length <= 0) {
    return;
  }

  var firstMarker = markers[0];

  var note = findParentNoteSegment(firstMarker, tagName);
  if (!note) {
    return;
  }

  return note && findEntireNote(note, tagName) || undefined;

};
