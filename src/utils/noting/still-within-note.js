var isVFocus = require('../vfocus/is-vfocus');
var isVText = require('../vfocus/is-vtext');
var isEmpty = require('../vfocus/is-empty');
var isScribeMarker = require('./is-scribe-marker');
var findParentNoteSegment = require('../noting/find-parent-note-segment');
var errorHandle = require('../error-handle');
var config = require('../../config');

module.exports = function isWithinNote(focus, tagName = config.get('defaultTagName'), isStandaloneNote = false) {

  if (!isVFocus(focus)) {
    errorHandle('Only a valid VFocus can be passed to isWithinNote, you passed: %s', focus);
  }

  // We consider selection marker as the end of note when the note is not overlaping other note(s)
  if (isStandaloneNote && isScribeMarker(focus)) {
    return false
  }

  return !isVText(focus) || isEmpty(focus) || !!findParentNoteSegment(focus, tagName);
};
