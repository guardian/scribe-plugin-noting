var isVFocus = require('../vfocus/is-vfocus');
var isNoteSegment = require('./is-note-segment');
var errorHandle = require('../error-handle');

module.exports = function findFirstNoteSegmentAbove(focus){

  if(!isVFocus(focus)){
    errorHandle('Only a valid VFocus can be passed to findFirstNoteSegmentAbove, you passed: %s', focus);
  }

  return focus.find(isNoteSegment, 'prev');

};
