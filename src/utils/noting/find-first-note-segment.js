var _ = require('lodash');
var isVFocus = require('../vfocus/is-vfocus');
var isWithinNote = require('./is-within-note');
var isNoteSegment = require('./is-note-segment');
var errorHandle = require('../error-handle');
var config = require('../../config');

module.exports = function findFirstNoteSegment(focus, tagName = config.get('defaultTagName')) {

  if (!isVFocus(focus)) {
    errorHandle('Only a valid VFocus can be passed to findFirstNoteSegment, you passed: %s', focus);
  }

  return _.last(
    focus.takeWhile((node)=> isWithinNote(node, tagName), 'prev').filter((node)=> isNoteSegment(node, tagName))
  );


};
