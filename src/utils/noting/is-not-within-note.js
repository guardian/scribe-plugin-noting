var isVFocus = require('../vfocus/is-vfocus');
var findParentNoteSegment = require('./find-parent-note-segment');
var errorHandle = require('../error-handle');

module.exports = function isNotWithinNote(focus) {

  if (!isVFocus(focus)) {
    errorHandle('Only a valid VFocus can be passed to isNotWithinNote, you passed: %s', focus);
  }

  return !findParentNoteSegment(focus);

};
