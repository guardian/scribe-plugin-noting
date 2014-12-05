var isVFocus = require('../../utils/vfocus/is-vfocus');
var hasClass = require('../../utils/vdom/has-class');
var addClass = require('./add-class');
var removeClass = require('./remove-class');

module.exports = function toggleClass(vNode, className) {

  if(isVFocus(vNode)){
    vNode = vNode.vNode;
  }

  if (!vNode || !className) {
    throw new Error('A valid vNode and className must be passed to toggleClass');
  }

  return hasClass(vNode, className) ? removeClass(vNode, className) : addClass(vNode, className);
};
