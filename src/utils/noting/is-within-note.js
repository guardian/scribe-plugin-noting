var isVFocus = require('../vfocus/is-vfocus');
var errorHandle = require('../error-handle');

var findScribeMarkers = require('./find-scribe-markers');
var isNotScribeMarker = require('./is-not-scribe-marker');
var isVText = require('../vfocus/is-vtext');
var findParentNoteSegment = require('./find-parent-note-segment');
var config = require('../../config');

module.exports = function isWithinNote(focus, tagName = config.get('defaultTagName')){

  if (!isVFocus(focus)){
    errorHandle('Only a valid VFocus element can be passed to isWithinNote, you passed: %s', focus);
  }

  var markers = findScribeMarkers(focus);
  if (!markers){
    return false;
  }

  if (markers.length === 2){
    var textNodesBetweenMarkers = markers[0]
        .next().takeWhile(isNotScribeMarker).filter(isVText);

    //if we dont get an array of text nodes back ... bail
    if (!textNodesBetweenMarkers.length){
      return false;
    }

    return textNodesBetweenMarkers.reduce((last, node)=>{
      return !!findParentNoteSegment(node, tagName) || last;
    }, false);

  } else {
    if(!markers[0]){
      return false;
    }
    return !!findParentNoteSegment(markers[0], tagName);
  }

}
