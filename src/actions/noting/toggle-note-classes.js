var _ = require('lodash');
var toggleClass = require('../vdom/toggle-class');

module.exports = function toggleNoteClasses(notes, className) {

  if (!notes || !className) {
    throw new Error('A valid collection of notes and a valid className must be passed to toggleNoteClasses');
  }

  notes = _.isArray(notes) ? notes : [notes];
  notes = _.flatten(notes);

  notes.forEach(function(vNode) {
    toggleClass(vNode, className);
  });

};
