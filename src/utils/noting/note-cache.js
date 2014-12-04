var isVFocus = require('../vfocus/is-vfocus');
var findAllNotes = require('./find-all-notes');

// cache the notes and update them when new notes are added
// caching the existing notes prevent needless tree traversal,
// which have O(n) complexity.
var cache;


function getNotesCache(focus) {
  if (!isVFocus(focus)) {
    throw new Error('only a valid VFocus can be passed to notesCache');
  }

  if(!cache || cache.length === 0){
    cache = setNotesCache(focus);
  }

  return cache;
}

function setNotesCache(focus) {

  if (!isVFocus(focus)) {
    throw new Error('only a valid VFocus can be passed to notesCache');
  }

  cache = findAllNotes(focus);
  return cache;
}

module.exports = {get: getNotesCache, set: setNotesCache};
