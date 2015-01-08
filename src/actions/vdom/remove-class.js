var hasClass = require('../../utils/vdom/has-class');
var errorHandle = require('../../utils/error-handle');

module.exports = function removeClass(vNode, className) {

  if (!vNode || !className) {
    errorHandle('Onlu a valid vNode and class name can be passed to removeClass, you passed: %s, %s', vNode, className);
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
