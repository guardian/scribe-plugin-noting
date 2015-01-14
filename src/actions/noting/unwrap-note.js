var _ = require('lodash');
var isVFocus = require('../../utils/vfocus/is-vfocus');
var isNoteSegment = require('../../utils/noting/is-note-segment');
var errorHandle = require('../../utils/error-handle');

module.exports = function unWrapNote(focus) {

  if (!isVFocus(focus) || !focus.parent) {
    errorHandle('Only a valid VFocus can be passed to unWrapNote, you passed: %s', focus);
  }

  if (!isNoteSegment(focus)) {
    errorHandle('Only a valid VFocus can be passed to unWrapnote, you passed: %s', focus);
  }

  var note = focus.vNode;

  var tree = !!focus.parent.vNode ? focus.parent.vNode.children : focus.parent.children;

  //remove note and add children
  tree.splice(tree.indexOf(note), 1, note.children);

  focus.parent.vNode.children = _.flatten(tree);

  // We want the note contents to now have their grandparent as parent.
  // The safest way we can ensure this is by changing the VFocus object
  // that previously focused on the note to instead focus on its parent.
  focus.vNode = focus.parent.vNode;
  focus.parent = focus.parent.parent;
  return focus;

};
