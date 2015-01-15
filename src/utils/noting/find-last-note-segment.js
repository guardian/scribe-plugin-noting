var isVFocus = require('../vfocus/is-vfocus');
var isWithinNote = require('./is-within-note');
var isNoteSegment = require('./is-note-segment');
var errorHandle = require('../error-handle');
var config = require('../../config');

module.exports = function findLastNoteSegment(focus, tagName = config.get('defaultTagName')) {

  if (!isVFocus(focus)) {
    errorHandle('only a valid VFocus can be passed to findFirstNoteSegment, you passed: %s', focus);
  }

  return focus
    .takeWhile((node)=> isWithinNote(node, tagName))
    .filter((node)=> isNoteSegment(node, tagName))
    .splice(-1)[0];

};
