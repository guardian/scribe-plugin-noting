var isVFocus = require('../vfocus/is-vfocus');
var isTag = require('../vdom/is-tag');
var errorHandle = require('../error-handle');

// function isNote
// identifies whether a given vfocus is a note
module.exports = function isNote(vfocus) {

  if (!isVFocus(vfocus)) {
    errorHandle('Only a valid VFocus element can be passed to isNote, you passed: %s', focus);
  }

  return isTag(vfocus.vNode, 'gu-note');
};
