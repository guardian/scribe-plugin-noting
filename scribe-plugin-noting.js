// Scribe noting plugin

var notingCommands = require('./src/noting-commands');

module.exports = function(user) {
  return function(scribe) {
    notingCommands.init(scribe, user);
  };
};
