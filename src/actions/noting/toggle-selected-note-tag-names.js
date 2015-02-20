var isVFocus = require('../../utils/vfocus/is-vfocus');
var VFocus = require('../../vfocus');
var errorHandle = require('../../utils/error-handle');

var findSelectedNote = require('../../utils/noting/find-selected-note');
var flattenTree = require('../../utils/vfocus/flatten-tree');
var isNoteSegment = require('../../utils/noting/is-note-segment');
var unWrapNote = require('./unwrap-note');

module.exports = function toggleSelectedNoteTagNames(focus, tagName, replacementTagName) {

  if (!isVFocus(focus)) {
    errorHandle('Only a valid VFocus can be passed to toggleSelectedNoteTagNames, you passed: %s', focus);
  }

  var noteSegments = findSelectedNote(focus, tagName);

  if (!noteSegments){
    return;
  }

  noteSegments.forEach((note)=> {

    //get any child notes that are now contained within our parent note
    var decendentNotes = note.filter((node)=> isNoteSegment(node, replacementTagName));
    //if we have any child notes of the new tag type, unwrap them (like a merge)
    if (!!decendentNotes.length) {
      decendentNotes.forEach((node)=> unWrapNote(node, replacementTagName));
    }


    flattenTree(note).forEach((vFocus)=> {
      if((vFocus.vNode.tagName === tagName) || (vFocus.vNode.tagName === tagName.toUpperCase())){
        vFocus.vNode.tagName = replacementTagName.toUpperCase();
      }
    });
  });


};

