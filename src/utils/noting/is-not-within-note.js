var isVFocus = require('../vfocus/is-vfocus');
var findParentNoteSegment = require('./find-parent-note-segment');
var errorHandle = require('../error-handle');
var config = require('../../config');

module.exports = function isNotWithinNote(focus, tagName = config.get('defaultTagName')) {

  if (!isVFocus(focus)) {
    errorHandle('Only a valid VFocus can be passed to isNotWithinNote, you passed: %s', focus);
  }

  return !findParentNoteSegment(focus, tagName);

};
