var flatten = require('lodash.flatten');
var isVFocus = require('../../utils/vfocus/is-vfocus');
var isVText = require('../../utils/vfocus/is-vtext');
var isEmpty = require('../../utils/vfocus/is-empty');

var findAllNotes = require('../../utils/noting/find-all-notes');
var flattenTree = require('../../utils/vfocus/flatten-tree');

var errorHandle = require('../../utils/error-handle');
var config = require('../../config');

module.exports = function removeEmptyNotes(focus, tagName = config.get('defaultTagName')) {

  if (!isVFocus(focus)) {
    errorHandle('Only a valid VFocus can be passed to removeEmptyNotes, you passed: %s', focus);
  }

  //return all notes from the given tree
  var allNoteSegments = flatten(findAllNotes(focus, tagName));

  var noteSequences = allNoteSegments.map(flattenTree);

  noteSequences.forEach(function(noteSequence) {

    var noteParent = noteSequence.splice(0, 1)[0];

    //if we have a totally empty note we have an array of 1
    if (noteSequence.length <= 0) {
      noteParent.remove();
      return;
    }

    var childrenAreEmpty = noteSequence.every(isEmpty);

    //if a note is totally empty remove it
    if (childrenAreEmpty) noteParent.remove();

  });

};
