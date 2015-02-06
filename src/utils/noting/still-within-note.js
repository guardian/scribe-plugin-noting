var isVFocus = require('../vfocus/is-vfocus');
var isVText = require('../vfocus/is-vtext');
var isEmpty = require('../vfocus/is-empty');
var findParentNoteSegment = require('../noting/find-parent-note-segment');
var errorHandle = require('../error-handle');
var config = require('../../config');

module.exports = function isWithinNote(focus, tagName = config.get('defaultTagName')) {

  if (!isVFocus(focus)) {
    errorHandle('Only a valid VFocus can be passed to isWithinNote, you passed: %s', focus);
  }


  return !isVText(focus) || isEmpty(focus) || !!findParentNoteSegment(focus, tagName);
};
