var toCamelCase = require('../to-camel-case');

module.exports = function hasAttribute(vNode, attribute, value) {

  if (!vNode || !attribute) {
    throw new Error('Incorret arguments passed to hasAttribute');
  }

  var isTestingDataAttib = /data/.test(attribute);
  var hasDataSet = !!vNode.properties && !!vNode.properties.dataset;


  //vdom-virtualize will parse data attributes into a dataset hash
  if (isTestingDataAttib && hasDataSet) {

    //remove 'data-'
    attribute = attribute.substring(5, attribute.length);

    //camel case
    attribute = toCamelCase(attribute);

    //test
    return vNode.properties.dataset[attribute] === value;
  }

  //virtual hyperscript will parse data attributes directly onto the properties hash
  else {
    if(!vNode.properties[attribute]) return false;

    if(!vNode.properties[attribute].value){
      return vNode.properties[attribute] === value;
    }

    return vNode.properties[attribute].value === value;
  }
};
