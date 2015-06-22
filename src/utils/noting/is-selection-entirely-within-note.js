var isVFocus = require('../vfocus/is-vfocus');

var findParentNoteSegment = require('./find-parent-note-segment');
var isNotScribeMarker = require('./is-not-scribe-marker');
var isVText = require('../vfocus/is-vtext');
var findScribeMarkers = require('./find-scribe-markers');
var errorHandle = require('../error-handle');
var config = require('../../config');

module.exports = function isSelectionEntirelyWithinNote(markers, tagName = config.get('defaultTagName')) {

  //if we pass a raw VFocus
  if (isVFocus(markers)) {
    markers = findScribeMarkers(markers);
  }

  //if we get passed the wrong argument
  if (!Array.isArray(markers)) {
    errorHandle('Only an array of markers or valid VFocus can be passed to isSelectionBetweenMarkers, you passed: %s', focus);
  }

  if (markers.length <= 0) {
    return;
  }

  // if we have two valid markers
  if (markers.length === 2) {
    var selection = markers[0]
      .next()
      .takeWhile(isNotScribeMarker)

      // We need the focusOnTextNode filter so we don't include P tags that
      // contains notes for example.
      .filter(isVText);


    if (selection.length <= 0) {
      errorHandle('Error retrieving selection. Probably means the selection\n' +
        'has been modified and the markers don\'t reflect the new selection.');
    }

    return !!selection.every((node)=> findParentNoteSegment(node, tagName));
  }
  //if we only have on valid marker
  //we see if it has a parent note
  else {
    return !!findParentNoteSegment(markers[0], tagName);
  }


};
