var isVFocus = require('./is-vfocus');
var isEmpty = require('../vdom/is-empty');
var errorHandle = require('../error-handle');

module.exports = function isEmptyVFocus(vfocus) {

  if (!isVFocus(vfocus)) {
    errorHandle('Onlu a valid VFocus can be passed to isEmptyVFocus, you passed: %s', focus);
  }

  return isEmpty(vfocus.vNode);
};
