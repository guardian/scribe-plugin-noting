var isVFocus = require('./is-vfocus.js');
var isTag = require('../vdom/is-tag.js');

module.exports = function isParagraphVFocus(focus) {

  if (!isVFocus(focus)) {
    throw new Error('only a VFocus element should be passed to isEmptyVFocus');
  }

  return isTag(focus.vNode, 'p');
};
