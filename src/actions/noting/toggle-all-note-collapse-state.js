var isVFocus = require('../../utils/vfocus/is-vfocus');
var toggleNoteClasses = require('./toggle-note-classes');
var findAllNotes = require('../../utils/noting/find-all-notes');

var NOTE_CLASS_COLLAPSED = 'note--collapsed';

module.exports = function toggleAllNoteCollapseState(focus) {

  if (!isVFocus(focus)) {
    throw new Error('Only a valid VFocus can be passed to toggleAllNoteCollapseState');
  }

  var notes = findAllNotes(focus);
  return toggleNoteClasses(notes, NOTE_CLASS_COLLAPSED);

};
