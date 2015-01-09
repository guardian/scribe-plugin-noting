var util = require('util');

module.exports = function handleSystemError(message, ...objs){
  var errorMsg = util.format(message, ...objs.map( obj => util.inspect(obj, {'depth': null})));
  throw new Error(errorMsg);
};
