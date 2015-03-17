var isNoteSegment = require('../noting/is-note-segment');
var isVFocus = require('../vfocus/is-vfocus');
var errorHandle = require('../error-handle');
var config = require('../../config');

module.exports = function findParentNoteSegment(focus, tagName = config.get('defaultTagName')) {

  if (!isVFocus(focus)) {
    errorHandle('Only a valid VFocus can be passed to findParentNoteSegment, you passed: %s', focus);
  }

  return focus.find((node) => isNoteSegment(node, tagName), 'up');
};
