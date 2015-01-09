var isVFocus = require('../../utils/vfocus/is-vfocus');
var toggleNoteClasses = require('./toggle-note-classes');
var findAllNotes = require('../../utils/noting/find-all-notes');
var config = require('../../config');
var errorHandle = require('../../utils/error-handle');


module.exports = function toggleAllNoteCollapseState(focus) {

  if (!isVFocus(focus)) {
    errorHandle('Only a valid VFocus can be passed to toggleAllNotesCollapseState, you passed: %s', focus);
  }

  var notes = findAllNotes(focus);
  return toggleNoteClasses(notes, config.get('noteCollapsedClass'));

};
