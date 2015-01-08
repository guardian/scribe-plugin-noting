var VText = require('vtree/vtext');

// We need these to make it possible to place the caret immediately
// inside/outside of a note.
module.exports = function createNoteBarrier(){
  return new VText('\u200B');
};

