var isVFocus = require('../vfocus/is-vfocus');
var stillWithinNote = require('./still-within-note');
var isNoteSegment = require('./is-note-segment');
var isEmpty = require('../vfocus/is-empty');
var errorHandle = require('../error-handle');
var config = require('../../config');

module.exports = function findLastNoteSegment(focus, tagName = config.get('defaultTagName'), isStandaloneNote = false) {

  if (!isVFocus(focus)) {
    errorHandle('only a valid VFocus can be passed to findFirstNoteSegment, you passed: %s', focus);
  }

  return focus
    .takeWhile((node)=> stillWithinNote(node, tagName, isStandaloneNote))
    .filter((node)=> isNoteSegment(node, tagName))
    .splice(-1)[0];
};
