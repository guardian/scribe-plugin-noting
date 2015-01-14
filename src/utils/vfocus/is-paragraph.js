var isVFocus = require('./is-vfocus.js');
var isTag = require('../vdom/is-tag.js');
var errorHandle = require('../error-handle');

module.exports = function isParagraphVFocus(focus) {

  if (!isVFocus(focus)) {
    errorHandle('Only a valid VFocus element can be passed to isParagraphVFocus, you passed: %s', focus);
  }

  return isTag(focus.vNode, 'p');
};
