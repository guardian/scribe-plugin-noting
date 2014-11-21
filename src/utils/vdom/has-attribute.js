module.exports = function(node, attribute, value){

  var dataSet = /data/.test(attribute)
    ? node.properties.dataset
    : node.properties;

    return dataSet ? (dataSet[attribute] === value) : false;
};

