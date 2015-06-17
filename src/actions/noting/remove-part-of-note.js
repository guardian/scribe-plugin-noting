var _ = require('lodash');
var VText = require('vtree/vtext');
var config = require('../../config');

var isVFocus = require('../../utils/vfocus/is-vfocus');
var errorHandle = require('../../utils/error-handle');
var findTextBetweenScribeMarkers = require('../../utils/noting/find-text-between-scribe-markers');
var findEntireNote = require('../../utils/noting/find-entire-note');
var flattenTree = require('../../utils/vfocus/flatten-tree');
var isVText = require('../../utils/vfocus/is-vtext');
var getNoteDataAttribs = require('../../utils/get-note-data-attrs');
var wrapInNote = require('./wrap-in-note');
var unWrapNote = require('./unwrap-note');
var ensureNoteIntegrity = require('./ensure-note-integrity');
var findScribeMarkers = require('../../utils/noting/find-scribe-markers');
var removeEmptyNotes = require('./remove-empty-notes');
var stripZeroWidthSpaces = require('./strip-zero-width-space');
/*
   Unnote part of note, splitting the rest of the original note into new notes.

   Example
   -------
   Text within a note has been selected:

   <p>Asked me questions about the vessel<gu-note>|, the time she left Marseilles|, the
   course she had taken,</gu-note> and what was her cargo. I believe, if she had not
   been laden, and I had been her master, he would have bought her.</p>


   We find the entire note and, within the note, we note everything _but_ what we want to unnote:

   <p>Asked me questions about the vessel<gu-note>, the time she left Marseilles<gu-note>, the
   course she had taken,</gu-note></gu-note> and what was her cargo. I believe, if she had not
   been laden, and I had been her master, he would have bought her.</p>


   Then we unwrap the previously existing note. The text we selected has been unnoted:

   <p>Asked me questions about the vessel, the time she left Marseilles<gu-note>, the
   course she had taken,</gu-note> and what was her cargo. I believe, if she had not
   been laden, and I had been her master, he would have bought her.</p>

*/
module.exports = function removePartofNote(focus, tagName = config.get('defaultTagName')){

  if (!isVFocus(focus)){
    errorHandle('Only a valid VFocus can be passed to unNotePartOfNote, you passed: %s', focus);
  }

  var focusesToUnnote = findTextBetweenScribeMarkers(focus);
  var entireNote = findEntireNote(focusesToUnnote[0], tagName);

  var entireNoteTextNodeFocuses = _(entireNote).map(flattenTree)
  .flatten().value().filter(isVText);

  var entireNoteTextNodes = entireNoteTextNodeFocuses.map(nodeFocus => nodeFocus.vNode);
  var textNodesToUnote = focusesToUnnote.map(nodeFocus => nodeFocus.vNode);
  var toWrapAndReplace = _.difference(entireNoteTextNodes, textNodesToUnote);

  var focusesToNote = entireNoteTextNodeFocuses.filter(nodeFocus => {
    return (textNodesToUnote.indexOf(nodeFocus.vNode) === -1)
  });

  var noteData = getNoteDataAttribs();

  // Wrap the text nodes.
  var wrappedTextNodes = toWrapAndReplace.map(nodeFocus => wrapInNote(nodeFocus, noteData, tagName));

  // Replace the nodes in the tree with the wrapped versions.
  focusesToNote.forEach((focus, i) => focus.replace(wrappedTextNodes[i]));

  // Unwrap previously existing note.
  entireNote.forEach((node)=> unWrapNote(node, tagName));

  // Unless the user selected the entire note contents, notes to the left
  // and/or right of the selection will have been created. We need to update
  // their attributes and CSS classes.
  var onlyPartOfContentsSelected = focusesToNote[0];
  if (onlyPartOfContentsSelected){
    ensureNoteIntegrity(onlyPartOfContentsSelected.top(), tagName);
  }

  // Place marker immediately before the note to the right (this way of doing
  // that seems to be the most reliable for some reason). Both Chrome and
  // Firefox have issues with this however. To force them to behave we insert
  // an empty span element inbetween.
  var markers = findScribeMarkers(focus.refresh());
  markers[0].remove();

  // If the user selected everything but a space (or zero width space), we remove
  // the remaining note. Most likely that's what our user intended.
  removeEmptyNotes(focus.refresh(), tagName);

  return focus;
};
