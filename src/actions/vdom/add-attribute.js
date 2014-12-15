var toCamelCase = require('../../utils/to-camel-case');

module.exports = function addAttribute(node, key, val) {

  node = (node.vNode || node);
  node.properties.dataset = (node.properties.dataset || {});

  if (/data/.test(key)) {
    //remove data- part of the string
    key = toCamelCase(key.replace(/data-/, ''));
    node.properties.dataset[key] = val;
  } else {
    node.properties[key] = val;
  }

};
