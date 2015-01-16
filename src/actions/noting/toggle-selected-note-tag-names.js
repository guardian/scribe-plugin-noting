var isVFocus = require('../../utils/vfocus/is-vfocus');
var errorHandle = require('../../utils/error-handle');

var findSelectedNote = require('../../utils/noting/find-selected-note');
var flattenTree = require('../../utils/vfocus/flatten-tree');

module.exports = function toggleSelectedNoteTagNames(focus, tagName, replacementTagName) {

  if (!isVFocus(focus)) {
    errorHandle('Only a valid VFocus can be passed to toggleSelectedNoteTagNames, you passed: %s', focus);
  }

  var noteSegments = findSelectedNote(focus, tagName);

  if (!noteSegments){
    return;
  }

  noteSegments.forEach((note)=> {
    flattenTree(note).forEach((vFocus)=> {
      if((vFocus.vNode.tagName === tagName) || (vFocus.vNode.tagName === tagName.toUpperCase())){
        vFocus.vNode.tagName = replacementTagName.toUpperCase();
      }
    });
  });

};

