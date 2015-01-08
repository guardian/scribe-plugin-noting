var isVFocus = require('../vfocus/is-vfocus');
var findAllNotes = require('./find-all-notes');
var errorHandle = require('../error-handle');

// cache the notes and update them when new notes are added
// caching the existing notes prevent needless tree traversal,
// which have O(n) complexity.
var cache;


function getNotesCache(focus) {
  if (!isVFocus(focus)) {
    errorHandle('Only a valid VFocus can be passed to notesCache.get, you passed: %s', focus);
  }

  if(!cache || cache.length === 0){
    cache = setNotesCache(focus);
  }

  return cache;
}

function setNotesCache(focus) {

  if (!isVFocus(focus)) {
    errorHandle('Only a valid VFocus can be passed to notesCache.set, you passed: %s', focus);
  }

  cache = findAllNotes(focus);
  return cache;
}

module.exports = {get: getNotesCache, set: setNotesCache};
