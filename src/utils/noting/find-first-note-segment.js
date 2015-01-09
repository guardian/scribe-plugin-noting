var _ = require('lodash');
var isVFocus = require('../vfocus/is-vfocus');
var isWithinNote = require('./is-within-note');
var isNoteSegment = require('./is-note-segment');
var errorHandle = require('../error-handle');

module.exports = function findFirstNoteSegment(focus) {

  if (!isVFocus(focus)) {
    errorHandle('Onlu a valid VFocus can be passed to findFirstNoteSegment, you passed: %s', focus);
  }

  return _.last(
    focus.takeWhile(isWithinNote, 'prev').filter(isNoteSegment)
  );


};
