var isVFocus = require('../vfocus/is-vfocus');
var errorHandle = require('../error-handle');
var config = require('../../config');
var findScribeMarkers = require('./find-scribe-markers');
var findPreviousNoteSegment = require('./find-previous-note-segment');
var isNoteSegment = require('../noting/is-note-segment');
var isScribeMarker = require('./is-scribe-marker');

module.exports = function isCaretNextToNote(focus, direction = 'next', tagName = config.get('defaultTagName')){

  if (!isVFocus(focus)) {
    errorHandle('Only a valid VFocus can be passed to isCaretNextToNote, you passed: %s', focus);
  }

  var markers = findScribeMarkers(focus);

  if (!markers.length || markers.length === 2) {
    return false;
  }

  var marker = markers[0];

  if (direction === 'next') {
    return !!marker.next() && !!marker.next().vNode && marker.next().vNode.tagName.toLowerCase() === tagName;
  } else {
    var previousNoteSegment = findPreviousNoteSegment(marker);
    if (!previousNoteSegment) {
      return false;
    }
    var index = previousNoteSegment.index();
    //get the next sibling which should be a zero width space
    var space = previousNoteSegment.parent.getChildAt(index + 1);
    return !!space && space.text === '\u200B';
 }

};
