// Scribe noting plugin
var generateNoteController = require('./src/generate-note-controller');


// config, example:
// { user: 'Firstname Lastname',
//   scribeInstancesSelector: '.ui-rich-text-editor__input' }
module.exports = function(config) {
  return function(scribe) {
    generateNoteController(scribe, config);
  };
};
