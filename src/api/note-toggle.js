/**
 * Noting API
 *
 * Perform noting actions on a Virtual DOM
 */
'use strict';

exports.user = 'unknown';

var h = require('virtual-hyperscript');
var _ = require('lodash');

var isVText = require('vtree/is-vtext');
var VText = require('vtree/vtext');

var NODE_NAME = 'GU-NOTE';
var TAG = 'gu-note';
var CLASS_NAME = 'note';
var DATA_NAME = 'data-note-edited-by';
var DATA_NAME_CAMEL = 'noteEditedBy';
var DATA_DATE = 'data-note-edited-date';
var DATA_DATE_CAMEL = 'noteEditedDate';
var NOTE_BARRIER_TAG = 'gu-note-barrier';

var vdom = require('./note-vdom');
var getEditedByTitleText = require('../utils/get-uk-date');
var wrapInNote = require('../actions/noting/wrap-in-note');
var unwrap = require('../actions/noting/unwrap-note');
var addUniqueVNodeClass = require('../actions/vdom/add-class');
var removeVNodeClass = require('../actions/vdom/remove-class');
var generateUUID = require('../utils/generate-uuid');
var updateNoteProperties = require('../actions/noting/reset-note-segment-classes');
var userAndTimeAsDatasetAttrs = require('../utils/get-note-data-attrs');
var createVirtualScribeMarker = require('../utils/create-virtual-scribe-marker');
var createNoteBarrier = require('../utils/create-note-barrier');
var updateNoteBarriers = require('../actions/noting/reset-note-barriers');
var createEmptyNoteAtCaret = require('../actions/noting/create-note-at-caret');
var preventBrTags = require('../actions/noting/remove-erroneous-br-tags');
var createNoteFromSelection = require('../actions/noting/create-note-from-selection');
var unnote = require('../actions/noting/remove-note');
var unnotePartOfNote = require('../actions/noting/remove-part-of-note');
var mergeIfNecessary = require('../actions/noting/merge-if-necessary');
var ensureNoteIntegrity = exports.ensureNoteIntegrity = require('../actions/noting/ensure-note-integrity');

exports.toggleNoteAtSelection = function toggleNoteAtSelection(treeFocus, selection) {
  function state() {
    var selectionMarkers = vdom.findMarkers(treeFocus);
    var selectionIsCollapsed = selectionMarkers.length === 1;
    var withinNote = vdom.selectionEntirelyWithinNote(selectionMarkers);

    var state;
    if (selectionIsCollapsed && withinNote) {
      state = 'caretWithinNote';
    } else if (withinNote) {
      state = 'selectionWithinNote';
    } else if (selectionIsCollapsed) {
      state = 'caretOutsideNote';
    } else {
      state = 'selectionOutsideNote'; // at least partially outside.
    }

    return state;
  }

  var scenarios = {
    caretWithinNote: function(treeFocus) {
      unnote(treeFocus);
    },
    selectionWithinNote: function(treeFocus) {
      unnotePartOfNote(treeFocus);
    },
    caretOutsideNote: function(treeFocus) {
      createEmptyNoteAtCaret(treeFocus);
    },
    selectionOutsideNote: function(treeFocus) {
      createNoteFromSelection(treeFocus);
    }
  };

  // Perform action depending on which state we're in.
  scenarios[state()](treeFocus);
};

// TODO: Replace with `selectionEntirelyWithinNote`.
exports.isSelectionInANote = function isSelectionInANote(selectionRange, parentContainer) {

  // Walk up the (real) DOM checking isTargetNode.
  function domWalkUpFind(node, isTargetNode) {
    if (!node.parentNode || node === parentContainer) {
      return false;
    }

    return isTargetNode(node) ? node : domWalkUpFind(node.parentNode, isTargetNode);
  }

  // Return the note our selection is inside of, if we are inside one.
  function domFindAncestorNote(node) {
    return domWalkUpFind(node, function(node) {
      return node.tagName === NODE_NAME;
    });
  }

  return domFindAncestorNote(selectionRange.startContainer) && domFindAncestorNote(selectionRange.endContainer) && true;
};

