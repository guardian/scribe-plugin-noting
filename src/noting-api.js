/**
 * Noting API
 *
 * Perform noting actions on a Virtual DOM
 */

var h = require('virtual-hyperscript');
var createElement = require('virtual-dom/create-element');
var isVNode = require('vtree/is-vnode');
var isVText = require('vtree/is-vtext');
var VText = require('vtree/vtext');
var _ = require('lodash');


var NODE_NAME = 'GU:NOTE';
var TAG = 'gu:note';

var CLASS_NAME = 'note';
var DATA_NAME = 'data-node-edited-by';
var DATA_NAME_CAMEL = 'noteEditedBy';
var DATA_DATE = 'data-note-edited-date';
var DATA_DATE_CAMEL = 'noteEditedDate';

exports.collapse = require('./api/note-collapse');


/**
 * Current User property must be set.
 * @type {String}
 */
exports.user = 'unknown';

/**
* Noting: Checks
*/

function focusOnMarker(focus) {
  return isScribeMarker(focus.vNode);
}

function focusOnTextNode (focus) {
  return focus.vNode.type === 'VirtualText';
}

function focusOnNote(focus) {
  return isNote(focus.vNode);
}

function focusOutsideNote(focus) {
  return ! findAncestorNoteSegment(focus);
}

function focusOnEmptyTextNode(focus) {
  // We consider zero width spaces as empty.
  function consideredEmpty(s) {
    return s === '' || s === '\u200B';
  }
  var vNode = focus.vNode;

  var result = isVText(vNode) && consideredEmpty(vNode.text);
  return isVText(vNode) && consideredEmpty(vNode.text);
}

// Whether a DOM node or vNode is a note.
// Case insensitive to work with both DOM nodes and vNodes
// (which can be lowercase).
function isNote(node) {
  return node.tagName && node.tagName.toLowerCase() === TAG;
}

function isScribeMarker(vNode) {
   return hasClass(vNode, 'scribe-marker');
}

// Check if VNode has class
function hasClass(vNode, value) {
  return (vNode.properties && vNode.properties.className === value);
}

function stillWithinNote(focus) {
  return !focusOnTextNode(focus) || focusOnEmptyTextNode(focus) || findAncestorNoteSegment(focus);
}


/**
* Noting: Finders and filters
*/

function findAncestorNoteSegment(focus) {
  return focus.find(focusOnNote, 'up');
}

function findTextNodeFocusesBetweenMarkers(treeFocus) {
  function focusNotOnMarker(focus) {
    return ! focusOnMarker(focus);
  }

  return focusOnlyTextNodes(
    treeFocus.find(focusOnMarker).next().takeWhile(focusNotOnMarker)
  );
}

function findMarkers(treeFocus) {
  return treeFocus.filter(focusOnMarker);
}

function findFirstNoteSegment(fNoteSegment) {
  return _.last(
    fNoteSegment.takeWhile(stillWithinNote, 'prev').filter(focusOnNote)
  );
}

function findLastNoteSegment(fNoteSegment) {
  return _.last(
    fNoteSegment.takeWhile(stillWithinNote).filter(focusOnNote)
  );
}

// Find the rest of a note.
// We identify notes based on 'adjacency' rather than giving them an id.
// This is because people may press RETURN or copy and paste part of a note.
// In such cases we don't want that to keep being the same note.
// noteSegment: focus on note
function findEntireNote(noteSegment) {
  return findFirstNoteSegment(noteSegment)
    .takeWhile(stillWithinNote).filter(focusOnNote);
}

function findEntireNoteTextNodeFocuses(noteSegment) {
  return findFirstNoteSegment(noteSegment).takeWhile(stillWithinNote).filter(focusOnTextNode).filter(function (focus) { return ! focusOnEmptyTextNode(focus); });
}

// Regurns an array of arrays of note segments
function findAllNotes(focus) {
  var treeFocus = focus.top();

  var notes = [];

  var focus = treeFocus;
  var firstNoteSegment;
  while (firstNoteSegment = focus.find(focusOnNote)) {
    var note = findEntireNote(firstNoteSegment);
    notes.push(note);

    focus = note[note.length - 1].next();
  }
  return notes;
}

function focusOnlyTextNodes (focuses) {
  return focuses.filter(focusOnTextNode);
}


/**
* Noting: Create, remove, wrap etc.
*/

// Wrap in a note.
// toWrap can be a vNode, DOM node or a string. One or an array with several.
function wrapInNote(toWrap, dataAttrs) {
  var nodes = toWrap instanceof Array ? toWrap : [toWrap];

  // Note that we have to clone dataAttrs or several notes might end up
  // sharing the same dataset object.
  var dataAttrs = dataAttrs ? _.clone(dataAttrs) : {};

  var note = h(TAG + '.' + CLASS_NAME, {dataset: dataAttrs}, nodes);
  return note;
}

function unwrap(focus) {
  var note = focus.vNode;
  var noteContents = note.children;
  var indexOfNode = focus.parent.vNode.children.indexOf(note);

  // Do the unwrapping.
  focus.parent.vNode.children.splice(indexOfNode, 1, noteContents); // replace note
  focus.parent.vNode.children = _.flatten(focus.parent.vNode.children);

  // We want the note contents to now have their grandparent as parent.
  // The safest way we can ensure this is by changing the VFocus object
  // that previously focused on the note to instead focus on its parent.
  focus.vNode = focus.parent.vNode;
  focus.parent = focus.parent.parent;
}

// Update note properties, adding them if they aren't already there.
// Note that this is also a way of merging notes, as we update the
// start and end classes as well as give the segments the same edited
// by information.
function updateNoteProperties(noteSegments) {
  updateStartAndEndClasses(noteSegments);
  noteSegments.forEach(updateEditedBy);
}

// Ensure the first (and only the first) note segment has a
// `note--start` class and that the last (and only the last)
// note segment has a `note--end` class.
function updateStartAndEndClasses(noteSegments) {
  function addStartAndEndClasses(noteSegments) {
    function addUniqueVNodeClass(vNode, name) {
      var classes = vNode.properties.className.split(' ');
      classes.push(name);

      vNode.properties.className = _.uniq(classes).join(' ');
    }

    addUniqueVNodeClass(noteSegments[0].vNode, 'note--start');
    addUniqueVNodeClass(noteSegments[noteSegments.length - 1].vNode, 'note--end');
  }

  function removeStartAndEndClasses(noteSegments) {
    function removeVNodeClass(vNode, name) {
      var classes = vNode.properties.className.split(' ');
      var classId = classes.indexOf(name);

      if (classId != -1) {
        classes.splice(classId, 1);
        vNode.properties.className = classes.join(' ');
      }
    }

    noteSegments.forEach(function(segment) {
      removeVNodeClass(segment.vNode, 'note--start');
      removeVNodeClass(segment.vNode, 'note--end');
    });
  }

  removeStartAndEndClasses(noteSegments);
  addStartAndEndClasses(noteSegments);
}

function updateEditedBy(noteSegment) {
  var dataset = userAndTimeAsDatasetAttrs();
  noteSegment.vNode.properties.dataset[DATA_NAME_CAMEL] = dataset[DATA_NAME_CAMEL];
  noteSegment.vNode.properties.dataset[DATA_DATE_CAMEL] = dataset[DATA_DATE_CAMEL];
}

function userAndTimeAsDatasetAttrs() {
  var dataset = {}
  dataset[DATA_NAME_CAMEL] = exports.user;
  dataset[DATA_DATE_CAMEL] = new Date().toISOString(); // how deal with timezone?

  return dataset;
}

function createVirtualScribeMarker() {
  return h('em.scribe-marker', []);
}

function createNoteBarrier() {
  return new VText('\u200B');
}

function removeVirtualScribeMarkers(treeFocus) {
  treeFocus.forEach(function(focus) {
    if (isScribeMarker(focus.vNode)) focus.remove();
  });
}





/**
* Noting: User initiated actions
*/

// tree - tree containing a marker.
// Note that we will mutate the tree.
function createEmptyNoteAtCaret(treeFocus) {
  // We need a zero width space character to make the note selectable.
  var zeroWidthSpace = '\u200B';

  // To make sure the caret is placed within the note we place a scribe
  // maker within it.
  // Chrome is picky about needing the space to be before the marker
  // (otherwise the caret won't be placed within the note).
  var replacementVNode = wrapInNote([zeroWidthSpace, createVirtualScribeMarker()], userAndTimeAsDatasetAttrs());

  // We assume there's only one marker.
  var marker = findMarkers(treeFocus)[0];
  marker.replace(replacementVNode);

  var noteSegments = findEntireNote(marker);
  updateNoteProperties(noteSegments);
}

// treeFocus: tree focus of tree containing two scribe markers
// Note that we will mutate the tree.
function createNoteFromSelection(treeFocus) {
  // We want to wrap text nodes between the markers. We filter out nodes that have
  // already been wrapped.
  var toWrapAndReplace = findTextNodeFocusesBetweenMarkers(treeFocus).filter(focusOutsideNote);

  // Wrap the text nodes.
  var userAndTime = userAndTimeAsDatasetAttrs();
  var wrappedTextNodes = toWrapAndReplace.map(function (focus) {
    return wrapInNote(focus.vNode, userAndTime);
  });

  // Replace the nodes in the tree with the wrapped versions.
  _.zip(toWrapAndReplace, wrappedTextNodes).forEach(function(focusAndReplacementVNode) {
    var focus = focusAndReplacementVNode[0];
    var replacementVNode = focusAndReplacementVNode[1];

    focus.replace(replacementVNode);
  });

  // We want to place the caret after the note. First we have to remove the
  // existing markers.
  removeVirtualScribeMarkers(treeFocus);

  // Then we place a new marker.
  // TODO: Think of a proper solution instead of using this "element in between" hack.
  //       Chrome has a bug which means it doesn't place the caret
  //       outside the note.
  //
  //       Also, being able to step in and out of notes might need a solution
  //       like this, but where we somehow always maintain one zero-space
  //       element at the beginning and end of each note.
  var lastNoteSegment = findLastNoteSegment(toWrapAndReplace[0]);
  lastNoteSegment.insertAfter([createNoteBarrier(), createVirtualScribeMarker()]);

  var noteSegments = findEntireNote(lastNoteSegment);
  updateNoteProperties(noteSegments);
}

function unnote(treeFocus) {
  // We assume the caller knows there's only one marker.
  var marker = findMarkers(treeFocus)[0];

  var noteSegment = findAncestorNoteSegment(marker);
  var noteSegments = findEntireNote(noteSegment);

  noteSegments.forEach(unwrap);

  // The marker is where we want it to be (the same position) so we'll
  // just leave it.
}


/*
Unnote part of note, splitting the rest of the original note into new notes.

Example
-------
Text within a note has been selected:

  <p>Asked me questions about the vessel<gu:note>|, the time she left Marseilles|, the
  course she had taken,</gu:note> and what was her cargo. I believe, if she had not
  been laden, and I had been her master, he would have bought her.</p>


We find the entire note and, within the note, we note everything _but_ what we want to unnote:

  <p>Asked me questions about the vessel<gu:note>, the time she left Marseilles<gu:note>, the
  course she had taken,</gu:note></gu:note> and what was her cargo. I believe, if she had not
  been laden, and I had been her master, he would have bought her.</p>


Then we unwrap the previously existing note. The text we selected has been unnoted:

  <p>Asked me questions about the vessel, the time she left Marseilles<gu:note>, the
  course she had taken,</gu:note> and what was her cargo. I believe, if she had not
  been laden, and I had been her master, he would have bought her.</p>

*/
function unnotePartOfNote(treeFocus) {
  function notToBeUnnoted(focus) {
    var candidateVTextNode = focus.vNode;
    return textNodesToUnnote.indexOf(candidateVTextNode) === -1;
  }

  var focusesToUnnote = findTextNodeFocusesBetweenMarkers(treeFocus);
  var entireNote = findEntireNote(focusesToUnnote[0]);
  var entireNoteTextNodeFocuses = findEntireNoteTextNodeFocuses(entireNote[0]);

  var entireNoteTextNodes = _(entireNote).map(function (focus) { return focus.vNode.children; }).flatten().filter(isVText).value();
  var textNodesToUnnote = focusesToUnnote.map(function (focus) { return focus.vNode; });
  var toWrapAndReplace = _.difference(entireNoteTextNodes, textNodesToUnnote);

  var focusesToNote = entireNoteTextNodeFocuses.filter(notToBeUnnoted);
  var userAndTime = userAndTimeAsDatasetAttrs();

  // Wrap the text nodes
  var wrappedTextNodes = toWrapAndReplace.map(function (vNode) {
    return wrapInNote(vNode, userAndTime);
  });

  // Replace the nodes in the tree with the wrapped versions.
  _.zip(focusesToNote, wrappedTextNodes).forEach(function(focusAndReplacementVNode) {
    var focus = focusAndReplacementVNode[0];
    var replacementVNode = focusAndReplacementVNode[1];

    focus.replace(replacementVNode);
  });

  removeVirtualScribeMarkers(treeFocus);

  // Unwrap previously existing note
  entireNote.forEach(unwrap);

  // Notes to the left and right of the selection may have been created.
  // We need to update their attributes and CSS classes.
  var lefty = findEntireNote(focusesToNote[0]);
  var righty = findEntireNote(focusesToNote[focusesToNote.length - 1]);

  updateNoteProperties(lefty);
  updateNoteProperties(righty);


  // Place marker at the end of the unnoted text.
  var endOfUnnotedText = righty[0].prev();
  endOfUnnotedText.insertAfter(createVirtualScribeMarker());
};


// TODO: Should return false when the start and end is within a note,
// but where there is unnoted text inbetween.
exports.isSelectionInANote = function isSelectionInANote(selectionRange, parentContainer) {

  // Walk up the (real) DOM checking isTargetNode.
  function domWalkUpFind(node, isTargetNode) {
    if (!node.parentNode || node === parentContainer) { return false; }

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


exports.toggleNoteAtSelection = function toggleNoteAtSelection(selection, treeFocus) {

  function state() {

    var withinNote = exports.isSelectionInANote(selection.range);

    var state;
    if (selection.selection.isCollapsed && withinNote) {
      state = 'caretWithinNote';
    } else if (withinNote) {
      state = 'selectionWithinNote';
    } else if (selection.selection.isCollapsed) {
      state = 'caretOutsideNote';
    } else {
      state = 'selectionOutsideNote'; // at least partially outside.
    }

    return state;
  }

  var scenarios = {
    caretWithinNote: function (treeFocus) { unnote(treeFocus); },
    selectionWithinNote: function (treeFocus) {  unnotePartOfNote(treeFocus);  },
    caretOutsideNote: function (treeFocus) { createEmptyNoteAtCaret(treeFocus); },
    selectionOutsideNote: function (treeFocus) { createNoteFromSelection(treeFocus); }
  };

  // Perform action depending on which state we're in.
  scenarios[state()](treeFocus);
};
