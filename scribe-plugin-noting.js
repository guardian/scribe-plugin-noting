// Scribe noting plugin
var generateNoteController = require('./src/generate-note-controller');
var NoteCommandFactory = require('./src/note-command-factory');
var config = require('./src/config');

var hasAddedCommands = false;

// config, example:
// { user: 'Firstname Lastname',
//   scribeInstancesSelector: '.ui-rich-text-editor__input' }
module.exports = function(attrs) {

  config.set(attrs)

  return function(scribe) {
    config.get('selectors').forEach(selector => {
      NoteCommandFactory(scribe, selector.commandName, selector.tagName);
    });
    hasAddedCommands = true;
    generateNoteController(scribe);
  };
};
