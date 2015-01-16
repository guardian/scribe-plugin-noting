var isVFocus = require('../../utils/vfocus/is-vfocus');
var toggleNoteClasses = require('./toggle-note-classes');
var findSelectedNote = require('../../utils/noting/find-selected-note');
var config = require('../../config');
var errorHandle = require('../../utils/error-handle');
var config = require('../../config');

module.exports = function toggleSelectedNoteCollapseState(focus, tagName = config.get('defaultTagName')) {

  if (!isVFocus(focus)) {
    errorHandle('Only a valid VFocus can be passed to toggleSelectedNoteCollapseState, you passed: %s', focus);
  }

  var note = findSelectedNote(focus, tagName);

  if (!note){
    return;
  }

  return toggleNoteClasses(note, config.get('noteCollapsedClass'));

};

