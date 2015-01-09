var isVFocus = require('../../utils/vfocus/is-vfocus');
var toggleNoteClasses = require('./toggle-note-classes');
var findSelectedNote = require('../../utils/noting/find-selected-note');
var config = require('../../config');
var errorHandle = require('../../utils/error-handle');


module.exports = function toggleSelectedNoteCollapseState(focus) {

  if (!isVFocus(focus)) {
    errorHandle('Only a valid VFocus can be passed to toggleSelectedNoteCollapseState, you passed: %s', focus);
  }

  var note = findSelectedNote(focus);

  if (!note){
    return;
  }

  return toggleNoteClasses(note, config.get('noteCollapsedClass'));

};
