var isVFocus = require('../../utils/vfocus/is-vfocus');
var hasClass = require('../../utils/vdom/has-class');
var addClass = require('./add-class');
var removeClass = require('./remove-class');
var errorHandle = require('../../utils/error-handle');

module.exports = function toggleClass(vNode, className) {

  if (isVFocus(vNode)) {
    vNode = vNode.vNode;
  }

  if (!vNode || !className) {
    errorHandle('A valid vNode and class name must be passed to toggleClass, you passed: %s, %s', vNode, className);
  }

  return hasClass(vNode, className) ? removeClass(vNode, className) : addClass(vNode, className);
};
