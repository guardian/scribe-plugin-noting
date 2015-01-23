var _ = require('lodash');
var VText = require('vtree/vtext');

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

// treeFocus: tree focus of tree containing two scribe markers
// Note that we will mutate the tree.
module.exports = function createNoteFromSelection(focus){

  if (!isVFocus(focus)){
    errorHandle('Only a valid VFocus element can be passed to createNoteFromSelection, you passed: %s', focus);
  }
  // We want to wrap text nodes between the markers. We filter out nodes that have
  // already been wrapped.
  var toWrapAndReplace = findTextBetweenScribeMarkers(focus).filter(isNotWithinNote);

  //wrap text nodes
  var noteDataSet = getNoteDataAttributes();
  var wrappedTextNodes = toWrapAndReplace.map(focus => wrapInNote(focus.vNode, noteDataSet));

  // Replace the nodes in the tree with the wrapped versions.
  _.zip(toWrapAndReplace, wrappedTextNodes).forEach(focusAndReplacementVNode => {
    var focus = focusAndReplacementVNode[0];
    var replacementVNode = focusAndReplacementVNode[1];
    focus.replace(replacementVNode);
  });

  // If we end up with an empty note a <BR> tag would be created. We have to do
  // this before we remove the markers.
  removeErroneousBrTags(focus);

  // We want to place the caret after the note. First we have to remove the
  // existing markers.
  removeScribeMarkers(focus);

  // Update note properties (merges if necessary).
  var lastNoteSegment = findLastNoteSegment(toWrapAndReplace[0]);
  var noteSegments = findEntireNote(lastNoteSegment);
  resetNoteSegmentClasses(noteSegments);

  // We need to clear the cache, and this has to be done before we place
  // our markers or we'll end up placing the cursor inside the note instead
  // of immediately after it.
  //
  // TODO: Revisit our caching strategy to make it less of a "foot gun", or
  // refactor so that we do less tree traversals and remove the caching.
  notesCache.set(focus);

  // Now let's place that caret.
  var outsideNoteFocus = noteSegments.splice(-1)[0].find(isNotWithinNote);

  // We guard against the case when the user notes the last piece of text in a
  // Scribe instance. In that case we don't bother placing the cursor.
  // (What behaviour would a user expect?)
  if (outsideNoteFocus){
    if (!isParagraph(outsideNoteFocus)){
      // The user's selection ends within a paragraph.
      // To place a marker we have to place an element inbetween the note barrier
      // and the marker, or Chrome will place the caret inside the note.
      outsideNoteFocus.insertBefore([new VText('\u200B'), createVirtualScribeMarker()]);
    } else {

      // The user's selection ends with a whole paragraph being selected. Now
      // we need to place the caret in a different manner (or we will end up
      // with a new empty paragraph). So we place the caret at the start of the
      // next paragraph.

      var firstNodeWithChildren = outsideNoteFocus.find(isNotEmpty);
      if (firstNodeWithChildren){
        firstNodeWithChildren.insertBefore(createVirtualScribeMarker());
      }

    }
  }

  removeEmptyNotes(focus);

  return focus;
};
