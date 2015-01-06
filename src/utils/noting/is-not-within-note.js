var isVFocus = require('../vfocus/is-vfocus');
var findParentNoteSegment = require('./find-parent-note-segment');

module.exports = function isNotWithinNote(focus) {

  if (!isVFocus(focus)) {
    throw new Error('Only a valid VFocus can be passed to isNotWithinNote');
  }

  return !findParentNoteSegment(focus);

};
