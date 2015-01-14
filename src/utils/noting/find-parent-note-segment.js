var isNoteSegment = require('../noting/is-note-segment');
var isVFocus = require('../vfocus/is-vfocus');
var errorHandle = require('../error-handle');

module.exports = function findParentNote(focus) {

  if (!isVFocus(focus)) {
    errorHandle('Only a valid VFocus can be passed to findParentNoteSegments, you passed: %s', focus);
  }

  return focus.find(isNoteSegment, 'up');
};
