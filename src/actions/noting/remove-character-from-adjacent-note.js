var isVFocus = require('../../utils/vfocus/is-vfocus');
var errorHandle = require('../../utils/error-handle');
var config = require('../../config');
var findScribeMarkers = require('../../utils/noting/find-scribe-markers');
var findNextNoteSegment = require('../../utils/noting/find-next-note-segment');
var isVText = require('../../utils/vfocus/is-vtext');

module.exports = function removeCharacterFromAdjacentNote(focus, direction = 'next', tagName = config.get('defaultTagName')){

  if (!isVFocus(focus)) {
    errorHandle('Only a valid VFocus can be passed to removeCharacterFromAdjacentNote, you passed: %s', focus);
  }

  var markers = findScribeMarkers(focus);
  if (!markers || markers.length === 2) {
    return focus;
  }

  var marker = markers[0];

  if (direction === 'next') {
    var firstNoteSegment = findNextNoteSegment(marker);
    var textNodes = firstNoteSegment.filter(isVText);
    //check the first element is a zero width space
    var firstTextNode = textNodes[0].vNode.text === '\u200B'
      ? textNodes[1]
      : textNodes[0];

      var characters = firstTextNode.vNode.text.split('');
      characters.splice(0, 1);
      firstTextNode.vNode.text = characters.join('');
  }

};
