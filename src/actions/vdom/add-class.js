var hasClass = require('../../utils/vdom/has-class');
var errorHandle = require('../../utils/error-handle');

module.exports = function addClass(vNode, className) {

  if (!vNode || !className) {
    errorHandle('A valid vNode and class name must be passed to addClass, you passed: %s, %s', vNode, className);
  }

  if (hasClass(vNode, className)) {
    return vNode;
  }

  if (!vNode.properties.className) {
    vNode.properties.className = className;
    return vNode;
  }

  vNode.properties.className = (vNode.properties.className + ' ' + className);
  return vNode;

};
