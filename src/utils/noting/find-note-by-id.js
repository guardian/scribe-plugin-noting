var _ = require('lodash');
var isVFocus = require('../vfocus/is-vfocus');
var hasNoteId = require('./has-note-id');
var findAllNotes = require('./find-all-notes');

// Find a note based on its ID. Will not always give the same result as `findEntireNote` ,
// since that'll recognize that a note is adjacent to another one. But when a note
// covers several paragraphs we can't be sure findEntireNote
// will give us the right result (see comment for findEntireNote).
//
// TODO: Redo findEntireNote to be based on findNote and IDs? Could perhaps
// find adjacent notes with the help of focus.prev() and focus.next().
module.exports = function findNoteById(focus, noteId) {

  if (!isVFocus(focus)) {
    throw new Error('Only a valid VFocus element can be passed to findNoteById');
  }


  var allNoteSegments = _.flatten(findAllNotes(focus));

  return allNoteSegments.filter(function(segment) {
    return hasNoteId(segment.vNode, noteId);
  });

};
