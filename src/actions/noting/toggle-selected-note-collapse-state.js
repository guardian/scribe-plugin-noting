var isVFocus = require('../../utils/vfocus/is-vfocus');
var toggleNoteClasses = require('./toggle-note-classes');
var findSelectedNote = require('../../utils/noting/find-selected-note');

var NOTE_CLASS_COLLAPSED = 'note--collapsed';

module.exports = function toggleSelectedNoteCollapseState(focus) {

  if (!isVFocus(focus)) {
    throw new Error('Only a valid VFocus can be passed to toggleSelectedNoteCollapseState');
  }

  var note = findSelectedNote(focus);
  return toggleNoteClasses(note, NOTE_CLASS_COLLAPSED);

};
