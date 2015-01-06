var _ = require('lodash');
var isVFocus = require('../vfocus/is-vfocus');
var isWithinNote = require('./is-within-note');
var isNoteSegment = require('./is-note-segment');

module.exports = function findFirstNote(focus) {

  if (!isVFocus(focus)) {
    throw new Error('Only a valid vfocus can be passed to findFirstNote');
  }

  return _.last(
    focus.takeWhile(isWithinNote).filter(isNoteSegment)
  );


};
