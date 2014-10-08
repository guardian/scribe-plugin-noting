// Scribe noting plugin

var notingCommands = require('./src/noting-commands');

// config, example:
// { user: 'Firstname Lastname',
//   scribeInstancesSelector: '.ui-rich-text-editor__input' }
module.exports = function(config) {
  return function(scribe) {
    notingCommands.init(scribe, config);
  };
};
