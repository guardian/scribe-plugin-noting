var _ = require('lodash');
var isVFocus = require('../vfocus/is-vfocus');
var isVText = require('../vfocus/is-vtext');
var isEmpty = require('../vfocus/is-empty');

var findAllNotes = require('./find-all-notes');
var flattenTree = require('../vfocus/flatten-tree');

module.exports = function removeEmptyNotes(focus) {
  if (!isVFocus(focus)) {
    throw new Error('only a valid VFocus can be passed to removeEmptyNotes');
  }

  //return all notes from the given tree
  var allNoteSegments = _.flatten(findAllNotes(focus));

  var noteSequences = allNoteSegments.map(flattenTree);

  noteSequences.forEach(function(noteSequence) {

    var noteParent = noteSequence.splice(0, 1)[0];

    //if we have a totally empty note we have an array of 1
    if (noteSequence.length <= 0) {
      noteParent.remove();
      return;
    }

    //assume we have only empty child elements
    //if one is not change the state of the check
    var childrenAreEmpty = noteSequence.reduce(function(check, childFocus) {
      if (!isEmpty(childFocus)) return false;
      else return true;
    }, true);

   //if a note is totally empty remove it
    if(childrenAreEmpty) noteParent.remove();

  });

};
