var hasClass = require('../../utils/vdom/has-class');

module.exports = function removeClass(vNode, className) {

  if (!vNode || !className) {
    throw new Error('A valid vNode and className must be passed to removeClass');
  }

  if (!hasClass(vNode, className)) {
    return vNode;
  }

  var regex = new RegExp(className, ['g']);
  vNode.properties.className = vNode.properties.className.replace(regex, '');
  return vNode;
};
