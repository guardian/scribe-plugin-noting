var toCamelCase = require('../../utils/to-camel-case');

module.exports = function addAttribute(node, key, val) {

  node = (node.vNode || node);
  node.properties.dataset = (node.properties.dataset || {});

  if (/data/.test(key)) {
    key = key.substring(5, key.length);
    key = toCamelCase(key);
    node.properties.dataset[key] = val;
  } else {
    node.properties[key] = val;
  }

};
