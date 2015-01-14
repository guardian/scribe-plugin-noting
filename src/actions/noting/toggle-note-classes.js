var _ = require('lodash');
var toggleClass = require('../vdom/toggle-class');
var addClass = require('../vdom/add-class');
var removeClass = require('../vdom/remove-class');
var collapseState = require('../../utils/collapse-state');
var errorHandle = require('../../utils/error-handle');

module.exports = function toggleNoteClasses(notes, className) {

  if (!notes || !className) {
    errorHandle('Only a valid VFocus can be passed to toggleNoteClasses, you passed: %s', focus);
  }

  notes = _.isArray(notes) ? notes : [notes];
  notes = _.flatten(notes);

  var action;
  if (notes.length === 1) {
    //if we have only one note we can assume that it should be toggled
    //because we assume it has been clicked
    action = toggleClass;
  } else {
    //if we have more than one note then we want them all to share state
    var state = collapseState.get();
    state ? action = removeClass : action = addClass;
    collapseState.set(!state);
  }

  notes.forEach(function(vNode) {
    vNode = (vNode.vNode || vNode);
    action(vNode, className);
  });

};
