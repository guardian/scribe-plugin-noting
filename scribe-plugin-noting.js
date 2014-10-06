// Scribe noting plugin

var notingCommands = require('./src/noting-commands');

module.exports = function(config) {
  return function(scribe) {
    var config = config || {
            user: 'Unknown user',
            scribeInstancesSelector: '.ui-rich-text-editor__input'
        }
                                    }
    notingCommands.init(scribe, config);
  };
};
