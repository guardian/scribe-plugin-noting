var hasClass = require('../../utils/vdom/has-class');

module.exports = function removeClass(vNode, className) {

  if (!vNode || !className) {
    throw new Error('A valid vNode and className must be passed to removeClass');
  }

  if (!hasClass(vNode, className)) {
    return vNode;
  }

  var regex = new RegExp(className, ['g']);
  vNode.properties.className.replace(regex, '');

  var classNames = vNode.properties.className.split(' ');
  var index = classNames.indexOf(className);

  classNames.splice(index, 1);
  vNode.properties.className = classNames.join(' ');

  return vNode;
};
