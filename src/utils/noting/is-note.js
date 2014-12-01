var isVFocus  = require('../vfocus/is-vfocus');
var isTag = require('../vdom/is-tag');

// function isNote
// identifies whether a given vfocus is a note
module.exports = function isNote(vfocus){

  if(!isVFocus(vfocus)) {
    throw new Error('only a VFocus element should be passed to isNote()');
  }

  return isTag(vfocus.vNode, 'gu-note');
};
