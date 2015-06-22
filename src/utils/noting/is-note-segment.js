var isVFocus = require('../vfocus/is-vfocus');
var isTag = require('../vdom/is-tag');
var errorHandle = require('../error-handle');
var config = require('../../config');

// function isNote
// identifies whether a given vfocus is a note
module.exports = function isNoteSegment(focus, tagName) {

  if (!isVFocus(focus)) {
    errorHandle('Only a valid VFocus element can be passed to isNote, you passed: %s', focus);
  }

  //if this function is placed within a iterator (takeWhile for example)
  //the index will be passed as second argument
  //as such we it's a good idea to check this.
  if(! typeof tagName === 'string') {
    errorHandle('tagName has to be passed to isNote as the second parameter, you passed: %s', tagName);
  }

  return isTag(focus.vNode, tagName);
};
