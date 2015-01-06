var isVFocus = require('../../utils/vfocus/is-vfocus');
var isNoteSegment = require('../../utils/noting/is-note-segment');

module.exports = function findFirstNoteSegmentBelow(focus){

  if(!isVFocus(focus)){
    throw new Error('only a valid VFocus can be passed to findFirstNoteSegmentAbove');
  }

  return focus.find(isNoteSegment);

};
