var VText = require('vtree/vtext');
var isVFocus = require('../../utils/vfocus/is-vfocus');
var isVText = require('../../utils/vfocus/is-vtext');
var findAllNotes = require('../../utils/noting/find-all-notes');
var createNoteBarrier = require('../../utils/create-note-barrier');
var isNotWithinNote = require('../../utils/noting/is-not-within-note');
var isNotEmpty = require('../../utils/vfocus/is-not-empty');
var errorHandle = require('../../utils/error-handle');
var config = require('../../config');

//In order to create the correct type of caret movement we need to insert zero width spaces.
//These are placed at the beginning (within) the note and at the end (outside) of the note.
//When merging or splitting notes it is important to ensure there are no spaces within the note body
//and at the beginning and end of the note
module.exports = function resetNoteBarriers(focus, tagName = config.get('defaultTagName')) {

  if (!isVFocus(focus)) {
    errorHandle('Only a valid VFocus element can be passed to resetNoteBarriers, you passed: ', focus);
  }

  //add new note barriers
  findAllNotes(focus, tagName).forEach(noteSegments => {


    //remove any note barriers that exist
    noteSegments.forEach((note)=>{
      note.filter(isVText).forEach(focus => {
        focus.vNode.text = focus.vNode.text.replace(/\u200B/g, '');
      });
    });


    //add zero width space to first note segment first note
    noteSegments[0].next().insertBefore(createNoteBarrier());

    //insert a note barrier after the current note
    var endingNoteSegment = noteSegments.slice(-1)[0];
    var nextNode = endingNoteSegment.find((node)=> isNotWithinNote(node, tagName));

    //check whether the adjacent node is a child of the notes parent
    //if not the note is at the end of a paragraph and the caret needs to be placed within that paragraph
    //NOT within the adjacent node
    var isWithinSameElement = !!nextNode
      ? (endingNoteSegment.parent.vNode.children.indexOf(nextNode.vNode) !== -1)
      : false;

    if (!isWithinSameElement) {
      endingNoteSegment.parent.addChild(new VText('\u200B'));
    } else {
      var index = nextNode.parent.vNode.children.indexOf(nextNode.vNode);
      if (index === -1) {
        return focus;
      }
      nextNode.parent.vNode.children.splice(index, 0, new VText('\u200B'));
    }

  });


};
