var isVFocus = require('../vfocus/is-vfocus');
var isNoteSegment = require('./is-note-segment');
var findEntireNote = require('./find-entire-note');
var errorHandle = require('../error-handle');
var config = require('../../config');

module.exports = function findAllNotes(focus, tagName = config.get('defaultTagName')) {

  if (!isVFocus(focus)) {
    errorHandle('Only a valid VFocus can be passed to findAllNotes, you passed: ', focus);
  }

  // Returns an array of arrays of note segments
  return focus
    .filter((node)=> isNoteSegment(node, tagName))
    .map((node)=> findEntireNote(node, tagName))
    .reduce(function(uniqueNotes, note) {
      // First iteration: Add the note.
      if (uniqueNotes.length === 0) return uniqueNotes.concat([note]);

      // Subsequent iterations: Add the note if it hasn't already been added.
      var lastUniqueNote = uniqueNotes[uniqueNotes.length - 1];
      return lastUniqueNote[0].vNode === note[0].vNode ? uniqueNotes : uniqueNotes.concat([note]);
    }, []);

};
