var hasClass = require('../../utils/vdom/has-class');

module.exports = function addClass(vNode, className) {

  if (!vNode || !className) {
    throw new Error('A valid vNode and className must be passed to addClass');
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
