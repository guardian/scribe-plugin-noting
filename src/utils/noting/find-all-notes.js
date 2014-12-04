var _ = require('lodash');
var isVFocus = require('../vfocus/is-vfocus');
var isNote = require('./is-note');
var findEntireNote = require('./find-entire-note');

var cache;

module.exports = function findAllNotes(focus) {

  if (!isVFocus(focus)) {
    throw new Error('Only a valid VFocus element can be passed to findNoteById');
  }

  // Returns an array of arrays of note segments
  return focus
    .filter(isNote)
    .map(findEntireNote)
    .reduce(function(uniqueNotes, note) {
      // First iteration: Add the note.
      if (uniqueNotes.length === 0) return uniqueNotes.concat([note]);

      // Subsequent iterations: Add the note if it hasn't already been added.
      return _.last(uniqueNotes)[0].vNode === note[0].vNode ? uniqueNotes : uniqueNotes.concat([note]);
    }, []);

};
