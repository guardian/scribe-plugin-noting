/**
 * Shared note vdom functions.
 */

'use strict';
//const
var NODE_NAME = 'GU-NOTE';
var TAG = 'gu-note';
var NOTE_BARRIER_TAG = 'gu-note-barrier';

var _ = require('lodash');
var isVText = require('vtree/is-vtext');

var hasClass = require('../utils/vdom/has-class');
var hasAttribute = require('../utils/vdom/has-attribute');
var isTag = require('../utils/vdom/is-tag');
var isEmpty = require('../utils/vdom/is-empty');

var focusOnNote = require('../utils/noting/is-note');
var focusOnMarker = require('../utils/noting/is-scribe-marker');
var focusNotOnMarker = require('../utils/noting/is-not-scribe-marker');
var focusOnTextNode = require('../utils/vfocus/is-vtext');
var focusOnEmptyTextNode = require('../utils/vfocus/is-empty');
var focusOnNonEmptyTextNode = require('../utils/vfocus/is-not-empty');
var focusOnParagraph = require('../utils/vfocus/is-paragraph');
var focusOnlyTextNodes = require('../utils/vfocus/find-text-nodes');
var focusOutsideNote = require('../utils/noting/is-not-within-note');

var hasNoteId = require('../utils/noting/has-note-id');
var stillWithinNote = require('../utils/noting/is-within-note');
var getNodesBetweenScribeMarkers = require('../utils/noting/find-between-scribe-markers');

var findAncestorNoteSegment = require('../utils/noting/find-parent-note');
var findTextNodeFocusesBetweenMarkers = require('../utils/noting/find-text-between-scribe-markers');
var findMarkers = require('../utils/noting/find-scribe-markers');
var findFirstNoteSegment = require('../utils/noting/find-first-note');
var findLastNoteSegment = require('../utils/noting/find-last-note');
var focusAndDescendants = require('../utils/vfocus/flatten-tree');

var withoutText = require('../utils/vfocus/has-no-text-children');
var withEmptyTextNode = require('../utils/vfocus/has-only-empty-text-children');

var findEntireNote = require('../utils/noting/find-entire-note');
var getAllNotes = require('../utils/noting/find-all-notes');
var findNote = require('../utils/noting/find-note-by-id');

var findSelectedNote = require('../utils/noting/find-selected-note');
var selectionEntirelyWithinNote = require('../utils/noting/is-selection-within-note');
var removeVirtualScribeMarkers = require('../utils/noting/remove-scribe-markers');
var removeEmptyNotes = require('../utils/noting/remove-empty-notes');

var notesCache = require('../utils/noting/note-cache');
var findAllNotes = notesCache.get;
var updateNotesCache = notesCache.set;



// Export the following functions
//   TODO: streamline these so that dependant modules use more generic functions

exports.focusAndDescendants = focusAndDescendants;
exports.focusOnEmptyTextNode = focusOnEmptyTextNode;
exports.focusOnNonEmptyTextNode = focusOnNonEmptyTextNode;
exports.focusOnMarker = focusOnMarker;
exports.focusOnNote = focusOnNote;
exports.focusOnParagraph = focusOnParagraph;
exports.focusOnTextNode = focusOnTextNode;
exports.withoutText = withoutText;
exports.withEmptyTextNode = withEmptyTextNode;
exports.findLastNoteSegment = findLastNoteSegment;
exports.focusOutsideNote = focusOutsideNote;
exports.findSelectedNote = findSelectedNote;
exports.findAllNotes = findAllNotes;
exports.findEntireNote = findEntireNote;
exports.findNote = findNote;
exports.findFirstNoteSegment = findFirstNoteSegment;
exports.findMarkers = findMarkers;
exports.findAncestorNoteSegment = findAncestorNoteSegment;
exports.findTextNodeFocusesBetweenMarkers = findTextNodeFocusesBetweenMarkers;
exports.removeEmptyNotes = removeEmptyNotes;
exports.removeVirtualScribeMarkers = removeVirtualScribeMarkers;
exports.selectionEntirelyWithinNote = selectionEntirelyWithinNote;
exports.updateNotesCache = updateNotesCache;
