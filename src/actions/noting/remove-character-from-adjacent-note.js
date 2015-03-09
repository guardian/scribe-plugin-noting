var VFocus = require('../../vfocus');
var _ = require('lodash');
var isVFocus = require('../../utils/vfocus/is-vfocus');
var errorHandle = require('../../utils/error-handle');
var config = require('../../config');
var findScribeMarkers = require('../../utils/noting/find-scribe-markers');
var findNextNoteSegment = require('../../utils/noting/find-next-note-segment');
var isVText = require('../../utils/vfocus/is-vtext');
var findPreviousNoteSegment = require('../../utils/noting/find-previous-note-segment');
var removeScribeMarkers = require('./remove-scribe-markers');
var createVirtualScribeMarker = require('../../utils/create-virtual-scribe-marker');
var findFirstNoteSegment = require('../../utils/noting/find-first-note-segment');
var findEntireNote = require('../../utils/noting/find-entire-note');

module.exports = function removeCharacterFromAdjacentNote(focus, direction = 'next', tagName = config.get('defaultTagName')){

  if (!isVFocus(focus)) {
    errorHandle('Only a valid VFocus can be passed to removeCharacterFromAdjacentNote, you passed: %s', focus);
  }

  var markers = findScribeMarkers(focus);
  if (!markers || markers.length === 2) {
    return focus;
  }

  var marker = markers[0];
  var note;
  var textNode;
  var textNodes;
  var characters;

  //TODO make this more dry WITHOUT using more if/else statements
  //jp 6-3-15
  if (direction === 'next') {
    note = findNextNoteSegment(marker, tagName);
    textNodes = note.filter(isVText);
    //check the first element is a zero width space
    textNode = textNodes[0].vNode.text === '\u200B'
      ? textNodes[1]
      : textNodes[0];

    if (!textNode) {
      return;
    }

    //remove only the first character from the next note
    characters = textNode.vNode.text.split('');
    characters.splice(1, 1);
    textNode.vNode.text = characters.join('');
    removeScribeMarkers(focus);

  } else {
    var lastNoteSegment = findPreviousNoteSegment(marker, tagName);
    var firstNoteSegment = findNextNoteSegment(lastNoteSegment, tagName);
    var note = findEntireNote(firstNoteSegment, tagName);

    //get all textnodes within the note
    var textNodes = note.map((noteSegment)=>{
      return noteSegment.children().filter((node)=> isVText(new VFocus(node)));
    });
    textNodes = _.flatten(textNodes);
    textNode = textNodes[textNodes.length -1].text === '\u200B'
      ? textNodes[textNodes.length - 2]
      : textNodes[textNodes.length - 1];

    if (!textNode) {
      return
    }

    //remove only the previous character from the previsou note
    characters = textNode.text.split('');
    characters.splice(characters.length -1, 1);
    textNode.text = characters.join('');
    removeScribeMarkers(focus);
    note.slice(-1)[0].addChild(createVirtualScribeMarker());
  }

};
