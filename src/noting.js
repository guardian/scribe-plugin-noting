// Scribe noting plugin

var notingCommands = require('./noting-commands');

module.exports = function(user) {
  return function(scribe) {
    notingCommands.init(scribe, user);
  }
};
