var isVFocus = require('../vfocus/is-vfocus');
var errorHandle = require('../error-handle');
var config = require('../../config');
var findScribeMarkers = require('./find-scribe-markers');
var findPreviousNoteSegment = require('./find-previous-note-segment');
var isScribeMarker = require('./is-scribe-marker.js');

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
    return !!marker.next() && !!marker.next().vNode && !!marker.next().vNode.tagName && marker.next().vNode.tagName.toLowerCase() === tagName;
  } else {
    var previousNoteSegment = findPreviousNoteSegment(marker, tagName);
    if (!previousNoteSegment) {
      return false;
    }
    //get the next sibling which should be a note : note -> zero width space -> caret -> note
    var zeroWidthSpace = previousNoteSegment.right();
    if (!zeroWidthSpace) {
      return false;
    }
    var marker = zeroWidthSpace.right();
    //test the marker exists
    //AND the zero width space contains ONLY a zero width space
    //AND that the marker IS a marker
    return !!marker && /^\u200B$/.test(zeroWidthSpace.vNode.text) && isScribeMarker(marker);
 }

};
