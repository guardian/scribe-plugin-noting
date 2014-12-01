module.exports = function hasAttribute(vNode, attribute, value){

  if(!vNode || !attribute){
    throw new Error('Incorret arguments passed to hasAttribute');
  }

  var isTestingDataAttib = /data/.test(attribute);

  var dataSet =
    ? vNode.properties.dataset
    : vNode.properties;

    return dataSet ? (dataSet[attribute] === value) : false;
};

