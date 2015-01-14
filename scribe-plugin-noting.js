// Scribe noting plugin

var notingCommands = require('./src/noting-commands');

var errorHandle = require('./src/utils/error-handle');


// config, example:
// { user: 'Firstname Lastname',
//   scribeInstancesSelector: '.ui-rich-text-editor__input' }
module.exports = function(config) {
  return function(scribe) {
    notingCommands.init(scribe, config);
  };
};
