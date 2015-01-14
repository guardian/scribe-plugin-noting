var isVText = require('vtree/is-vtext');

var VFocus = require('../../vfocus');
var isVFocus = require('../vfocus/is-vfocus');
var errorHandle = require('../error-handle');

module.exports = function isVTextVFocus(vfocus) {

  if (!isVFocus(vfocus)) {
    errorHandle('Only a valid VFocus can be pased to isVTextVFocus, you passed: %s', focus);
  }

  return isVText(vfocus.vNode);

};
