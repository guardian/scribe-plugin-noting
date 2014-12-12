var isVFocus = require('../../utils/vfocus/is-vfocus');
var isVText = require('../../utils/vfocus/is-vtext');
var findAllNotes = require('../../utils/noting/find-all-notes');
var createNoteBarrier = require('../../utils/create-note-barrier');
var isNotWithinNote = require('../../utils/noting/is-not-within-note');
var isNotEmpty = require('../../utils/vfocus/is-not-empty');

module.exports = function resetNoteBarriers(focus) {

  if (!isVFocus(focus)) {
    throw new Error('Only a valid VFocus element can be passed to resetNoteBarriers');
  }

  //remove all note barriers
  focus.filter(isVText).forEach(function(focus) {
    focus.vNode.text = focus.vNode.text.replace(/\u200B/g, '');
  });

  //add new note barriers
  findAllNotes(focus).forEach(function(noteSegmentFocus) {
    //add a note barrier to the beginning of a note
    noteSegmentFocus[0].next().insertBefore(createNoteBarrier());

    //add a note to the beginning of the nearest non empty text node
    var nearestSibling = noteSegmentFocus[noteSegmentFocus.length - 1].find(isNotWithinNote);
    var nearestTextSibling = nearestSibling && nearestSibling.find(isNotEmpty);

    if (nearestTextSibling) {
      nearestSibling.vNode.text = '\u200B' + nearestTextSibling.vNode.text;
    }

  });

  return focus;

};
