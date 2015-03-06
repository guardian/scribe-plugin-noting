var isVFocus = require('../../utils/vfocus/is-vfocus');
var errorHandle = require('../../utils/error-handle');
var config = require('../../config');
var findScribeMarkers = require('../../utils/noting/find-scribe-markers');
var findNextNoteSegment = require('../../utils/noting/find-next-note-segment');
var isVText = require('../../utils/vfocus/is-vtext');
var findPreviousNoteSegment = require('../../utils/noting/find-previous-note-segment');
var removeScribeMarkers = require('./remove-scribe-markers');
var createVirtualScribeMarker = require('../../utils/create-virtual-scribe-marker');

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
    note = findNextNoteSegment(marker);
    textNodes = note.filter(isVText);
    //check the first element is a zero width space
    textNode = textNodes[0].vNode.text === '\u200B'
      ? textNodes[1]
      : textNodes[0];

    if (!textNode) {
      return;
    }

    characters = textNode.vNode.text.split('');
    characters.splice(1, 1);
    textNode.vNode.text = characters.join('');
    removeScribeMarkers(focus);

  } else {
    note = findPreviousNoteSegment(marker);
    textNodes = note.filter(isVText);
    textNode = textNodes[textNodes.length -1].vNode.text === '\u200B'
      ? textNodes[textNodes.length - 2]
      : textNodes[textNodes.length - 1]

    if (!textNode) {
      return
    }

    characters = textNode.vNode.text.split('');
    characters.splice(characters.length -1, 1);
    textNode.vNode.text = characters.join('');
    removeScribeMarkers(focus);
    note.addChild(createVirtualScribeMarker());
  }

};
