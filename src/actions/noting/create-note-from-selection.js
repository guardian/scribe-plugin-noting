var _ = require('lodash');
var VText = require('vtree/vtext');
var config = require('../../config');

var isVFocus = require('../../utils/vfocus/is-vfocus');
var errorHandle = require('../../utils/error-handle');
var findTextBetweenScribeMarkers = require('../../utils/noting/find-text-between-scribe-markers');
var getNoteDataAttributes = require('../../utils/get-note-data-attrs');
var wrapInNote = require('./wrap-in-note');
var removeErroneousBrTags = require('./remove-erroneous-br-tags');
var removeScribeMarkers = require('./remove-scribe-markers');
var findLastNoteSegment = require('../../utils/noting/find-last-note-segment');
var findEntireNote = require('../../utils/noting/find-entire-note');
var resetNoteSegmentClasses = require('./reset-note-segment-classes');
var notesCache = require('../../utils/noting/note-cache');
var isNotWithinNote = require('../../utils/noting/is-not-within-note');
var isParagraph = require('../../utils/vfocus/is-paragraph');
var createVirtualScribeMarker = require('../../utils/create-virtual-scribe-marker');
var isNotEmpty = require('../../utils/vfocus/is-not-empty');
var removeEmptyNotes = require('../../actions/noting/remove-empty-notes');
var findScribeMarkers = require('../../utils/noting/find-scribe-markers');
var hasClass = require('../../utils/vdom/has-class');

// treeFocus: tree focus of tree containing two scribe markers
// Note that we will mutate the tree.
module.exports = function createNoteFromSelection(focus, tagName = config.get('defaultTagName')) {

  if (!isVFocus(focus)) {
    errorHandle('Only a valid VFocus element can be passed to createNoteFromSelection, you passed: %s', focus);
  }
  // We want to wrap text nodes between the markers. We filter out nodes that have
  // already been wrapped.
  var toWrapAndReplace = findTextBetweenScribeMarkers(focus).filter((node) => isNotWithinNote(node, tagName));

  //wrap text nodes
  var noteDataSet = getNoteDataAttributes();
  var wrappedTextNodes = toWrapAndReplace.map(focus => wrapInNote(focus.vNode, noteDataSet, tagName));

  // Replace the nodes in the tree with the wrapped versions.
  toWrapAndReplace
    .map((f, i) => [toWrapAndReplace[i], wrappedTextNodes[i]]) // zip
    .forEach(focusAndReplacementVNode => {
      var focus = focusAndReplacementVNode[0];
      var replacementVNode = focusAndReplacementVNode[1];
      focus.replace(replacementVNode);
  });

  // If we end up with an empty note a <BR> tag would be created. We have to do
  // this before we remove the markers.
  removeErroneousBrTags(focus, tagName);

  // Update note properties (merges if necessary).
  var lastNoteSegment = findLastNoteSegment(toWrapAndReplace[0], tagName);
  var noteSegments = findEntireNote(lastNoteSegment, tagName);
  resetNoteSegmentClasses(noteSegments, tagName);

  // We need to clear the cache, and this has to be done before we place
  // our markers or we'll end up placing the cursor inside the note instead
  // of immediately after it.
  //
  // TODO: Revisit our caching strategy to make it less of a "foot gun", or
  // refactor so that we do less tree traversals and remove the caching.
  notesCache.set(focus);

  // Now let's place that caret.var
  removeScribeMarkers(focus);

  //first note barrier
  noteSegments[0].vNode.children.unshift(new VText('\u200B'));

  var endingNoteSegment = noteSegments.slice(-1)[0];
  var nextNode = endingNoteSegment.find((node)=> isNotWithinNote(node, tagName));
  //check whether the adjacent node is a child of the notes parent
  //if not the note is at the end of a paragraph and the caret needs to be placed within that paragraph
  //NOT within the adjacent node
  var isWithinSameElement = !!nextNode ? (endingNoteSegment.parent.vNode.children.indexOf(nextNode.vNode) !== -1) : false;

  if (!isWithinSameElement) {
    endingNoteSegment.parent.addChild(new VText('\u200B'));
    endingNoteSegment.parent.addChild(createVirtualScribeMarker());
  } else {
    var index = nextNode.parent.vNode.children.indexOf(nextNode.vNode);
    if (index === -1) {
      return focus;
    }
    nextNode.parent.vNode.children.splice(index, 0, new VText('\u200B'), createVirtualScribeMarker());
  }

  removeEmptyNotes(focus, tagName);
  return focus;
};
