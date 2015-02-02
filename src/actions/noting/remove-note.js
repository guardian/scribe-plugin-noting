var isVFocus = require('../../utils/vfocus/is-vfocus');
var errorHandle = require('../../utils/error-handle');
var config = require('../../config');

var findScribeMarkers = require('../../utils/noting/find-scribe-markers');
var noteCache = require('../../utils/noting/note-cache');
var findParentNoteSegment = require('../../utils/noting/find-parent-note-segment');
var findNoteById = require('../../utils/noting/find-note-by-id');
var unWrapNote = require('./unwrap-note');
var ensureNoteIntegrity = require('./ensure-note-integrity');


// treeFocus: tree focus of tree containing two scribe markers
// Note that we will mutate the tree.
module.exports = function removeNote(focus, tagName = config.get('defaultTagName')){

  if (!isVFocus(focus)){
    errorHandle('Only a valid VFocus element can be passed to removeNote, you passed: %s', focus);
  }

  // We assume the caller knows there's only one marker.
  var marker = findScribeMarkers(focus)[0];

  noteCache.set(focus);

  // We can't use findEntireNote here since it'll sometimes give us the wrong result.
  // See `findEntireNote` documentation. Instead we look the note up by its ID.

  var noteSegment = findParentNoteSegment(marker, tagName);
  var noteSegments = findNoteById(focus, noteSegment.vNode.properties.dataset.noteId, tagName);

  noteSegments.forEach((node)=> unWrapNote(node, tagName));

  ensureNoteIntegrity(focus, tagName);

  // The marker is where we want it to be (the same position) so we'll
  // just leave it.
  return focus;

};
