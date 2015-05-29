var _ = require('lodash');
var toggleClass = require('../vdom/toggle-class');
var addClass = require('../vdom/add-class');
var removeClass = require('../vdom/remove-class');
var errorHandle = require('../../utils/error-handle');
var hasClass = require('../../utils/vdom/has-class');
var isVFocus = require('../../utils/vfocus/is-vfocus');

module.exports = function toggleNoteClasses(notes, className) {
  notes = _.isArray(notes) ? notes : [notes];
  notes = _.flatten(notes);

  if (notes.some(focus => !isVFocus(focus)) || !className) {
    errorHandle('Only a valid VFocus(es) can be passed to toggleNoteClasses, you passed: %s', notes);
  }

  var action;
  if (notes.length === 1) {
    //if we have only one note we can assume that it should be toggled
    //because we assume it has been clicked
    action = toggleClass;
  } else {
    //if we have more than one note then we want them all to share state
    var state = notes.every(noteSegment => hasClass(noteSegment.vNode, className));
    state ? action = removeClass : action = addClass;
  }

  notes.forEach(function(vNode) {
    vNode = (vNode.vNode || vNode);
    action(vNode, className);
  });

};
