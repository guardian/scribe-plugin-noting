var isVFocus = require('../vfocus/is-vfocus');
var isWithinNote = require('./is-within-note');
var isNoteSegment = require('./is-note-segment');
var errorHandle = require('../error-handle');

module.exports = function findLastNoteSegment(focus) {

  if (!isVFocus(focus)) {
    errorHandle('only a valid VFocus can be passed to findFirstNoteSegment, you passed: %s', focus);
  }

  return focus.takeWhile(isWithinNote).filter(isNoteSegment).splice(-1)[0];

};
