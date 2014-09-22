/**
 * Noting API
 *
 * Perform noting actions on a Virtual DOM
 */
'use strict';

var h = require('virtual-hyperscript');
var isVText = require('vtree/is-vtext');
var VText = require('vtree/vtext');
var _ = require('lodash');


// NOTE: This tag is invalid. Custom elements must include
// a '-' or browsers consider them invalid. Can probaly lead to
// quirks in behaviour. It's also possible to register them.
// Not sure if one is expected to do that.
// (See: http://www.html5rocks.com/en/tutorials/webcomponents/customelements/)
var NODE_NAME = 'GU:NOTE';
var TAG = 'gu:note';

var CLASS_NAME = 'note';
var DATA_NAME = 'data-node-edited-by';
var DATA_NAME_CAMEL = 'noteEditedBy';
var DATA_DATE = 'data-note-edited-date';
var DATA_DATE_CAMEL = 'noteEditedDate';
var NOTE_BARRIER_TAG = 'gu:note-barrier';


var vdom = require('./note-vdom');


/**
 * Current User property must be set.
 * @type {String}
 */
exports.user = 'unknown';

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

  var treeFocus = noteSegments[0].top();
  updateNoteBarriers(treeFocus);
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
  var dataset = {};
  dataset[DATA_NAME_CAMEL] = exports.user;
  dataset[DATA_DATE_CAMEL] = new Date().toISOString(); // how deal with timezone?

  return dataset;
}

function createVirtualScribeMarker() {
  return h('em.scribe-marker', []);
}

function createNoteBarrier() {
  // Note that the note barrier must be empty. This prevents the web
  // browser from ever placing the caret inside of the tag. The problem
  // with allowing the caret to be placed inside of the tag is that we'll
  // end up with text within the note barriers.
  //
  // However, keeping it empty makes it necessary to specify the CSS
  // ".note-barrier { display: inline-block }" or browsers will render
  // a line break after each note barrier.
  return h(NOTE_BARRIER_TAG + '.note-barrier');
}

function updateNoteBarriers(treeFocus) {
  function removeNoteBarriers(treeFocus) {
    treeFocus.filter(vdom.focusOnNoteBarrier).forEach(function (barrier) {
      barrier.remove();
    });
  }

  function insertNoteBarriers(treeFocus) {
    vdom.findAllNotes(treeFocus).forEach(function (noteSegments) {
      _.first(noteSegments).next().insertBefore(createNoteBarrier());
      _.last(noteSegments).insertAfter(createNoteBarrier());
    });
  }

  removeNoteBarriers(treeFocus);
  insertNoteBarriers(treeFocus);
}

function removeVirtualScribeMarkers(treeFocus) {
  treeFocus.forEach(function(focus) {
    if (vdom.isScribeMarker(focus.vNode)) focus.remove();
  });
}

// To clean up after ourselves, when a user removes notes by e.g. pressing
// BACKSPACE.
function removeLeftoverZeroWidthSpaces(treeFocus) {
  var nonNoteTextNodeFocuses = treeFocus.filter(vdom.focusOutsideNote)
    .filter(vdom.focusOnTextNode);

  nonNoteTextNodeFocuses.forEach(function (focus) {
    var vNode = focus.vNode;
    if (vNode.text.length > 1) {
      vNode.text = vNode.text.replace(/\u200B/g, '');
    }
  });
}

// To clean up after ourselves, when a user removes notes by e.g. pressing
// BACKSPACE.
function removeEmptyNodes(treeFocus) {
  function criteria(focus) {
    return vdom.withoutText(focus) || vdom.withEmptyTextNode(focus);
  }

  // Move any space we delete to the previous note segment.
  function moveSpaceToPrevSegment(node) {
    if (vdom.focusOnNote(node)) {
      var prevNoteSegment = node.prev().find(vdom.focusOnNote, 'prev');
      if (prevNoteSegment) {
        var lastTextNode = _.last(prevNoteSegment.vNode.children.filter(isVText));
        if (lastTextNode) lastTextNode.text = lastTextNode.text + ' ';
      }
    }
  }

  return treeFocus.filter(function (focus) { return ! vdom.focusOnTextNode(focus); }).filter(criteria).map(function (node) {
    moveSpaceToPrevSegment(node);
    return node.remove();
  });
}





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
  var marker = vdom.findMarkers(treeFocus)[0];
  marker.replace(replacementVNode);

  var noteSegments = vdom.findEntireNote(marker);
  updateNoteProperties(noteSegments);
}

// treeFocus: tree focus of tree containing two scribe markers
// Note that we will mutate the tree.
function createNoteFromSelection(treeFocus) {
  // We want to wrap text nodes between the markers. We filter out nodes that have
  // already been wrapped.
  var toWrapAndReplace = vdom.findTextNodeFocusesBetweenMarkers(treeFocus).filter(vdom.focusOutsideNote);

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
  var lastNoteSegment = vdom.findLastNoteSegment(toWrapAndReplace[0]);
  lastNoteSegment.insertAfter([createNoteBarrier(), createVirtualScribeMarker()]);

  var noteSegments = vdom.findEntireNote(lastNoteSegment);
  updateNoteProperties(noteSegments);
}

function unnote(treeFocus) {
  // We assume the caller knows there's only one marker.
  var marker = vdom.findMarkers(treeFocus)[0];

  var noteSegment = vdom.findAncestorNoteSegment(marker);
  var noteSegments = vdom.findEntireNote(noteSegment);

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

  var focusesToUnnote = vdom.findTextNodeFocusesBetweenMarkers(treeFocus);
  var entireNote = vdom.findEntireNote(focusesToUnnote[0]);
  var entireNoteTextNodeFocuses = vdom.findEntireNoteTextNodeFocuses(entireNote[0]);

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

  // Note: refresh() is necessary here. Maybe possible to avoid somehow,
  // but as of now the focusesToNote focuses are not reliable.
  var startOfLefty = focusesToNote[0].refresh()
  var lefty = vdom.findEntireNote(startOfLefty);

  var startOfRighty = focusesToNote[focusesToNote.length - 1].refresh();
  var righty = vdom.findEntireNote(startOfRighty);

  updateNoteProperties(lefty);
  updateNoteProperties(righty);


  // Place marker at the end of the unnoted text.
  var endOfUnnotedText = righty[0].prev();
  endOfUnnotedText.insertAfter(createVirtualScribeMarker());
}


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
    caretWithinNote: function (treeFocus) { unnote(treeFocus); },
    selectionWithinNote: function (treeFocus) {  unnotePartOfNote(treeFocus);  },
    caretOutsideNote: function (treeFocus) { createEmptyNoteAtCaret(treeFocus); },
    selectionOutsideNote: function (treeFocus) { createNoteFromSelection(treeFocus); }
  };

  // Perform action depending on which state we're in.
  scenarios[state()](treeFocus);
};


/*
  Example. We have two notes:
  <p>
    <gu:note>Some noted text</gu:note>| and some other text inbetween |<gu:note>More noted text</gu:note>
  </p>

  We press BACKSPACE, deleting the text, and end up with:
  <p>
    <gu:note data-note-edited-by="Edmond Dantès" data-note-edited-date="2014-09-15T16:49:20.012Z">Some noted text</gu:note><gu:note data-note-edited-by="Lord Wilmore" data-note-edited-date="2014-09-20T10:00:00.012Z">More noted text</gu:note>
  </p>

  This function will merge the notes:
  <p>
    <gu:note data-note-edited-by="The Count of Monte Cristo" data-note-edited-date="2014-10-10T17:00:00.012Z">Some noted text</gu:note><gu:note data-note-edited-by="The Count of Monte Cristo" data-note-edited-date="2014-10-10T17:00:00.012Z">More noted text</gu:note>
  </p>

  The last user to edit "wins", the rationale being that they have approved
  these notes by merging them. In this case all note segments are now
  listed as being edited by The Count of Monte Cristo and the timestamp
  shows the time when the notes were merged.
*/
function mergeIfNecessary(treeFocus) {
  function inconsistentTimestamps(note) {
    function getDataDate(noteSegment) {
      return noteSegment.vNode.properties.dataset[DATA_DATE_CAMEL];
    }

    var uniqVals = _(note).map(getDataDate).uniq().value();
    return uniqVals.length > 1;
  }

  // Merging is simply a matter of updating the attributes of any notes
  // where all the segments of the note doesn't have the same timestamp.
  vdom.findAllNotes(treeFocus).filter(inconsistentTimestamps).forEach(updateNoteProperties);
}

function preventBrTags(treeFocus) {
  function removeEmptyNoteSegments(treeFocus) {
    function criteria(focus) {
      return vdom.withoutText(focus) || vdom.withEmptyTextNode(focus);
    }

    var noteSegments = _.flatten(vdom.findAllNotes(treeFocus));
    return noteSegments.filter(criteria).map(function (segment) {
      return segment.remove();
    });
  }

  function removeAncestorsIfNecessary(focus) {
    var f = focus;
    while (f) {
      if (! f.canDown()) f.remove();
      f = f.up();
    }
  }

  // Unfortunately we sometimes end up with empty nodes and zero width
  // characters in the HTML outside of note tags. We rely on
  // `ensureContentIntegrity` cleaning this up.
  var removedTags = removeEmptyNoteSegments(treeFocus);
  removedTags.forEach(removeAncestorsIfNecessary);
}

exports.ensureContentIntegrity = function (treeFocus) {
  // Clean up.
  removeEmptyNodes(treeFocus);
  removeLeftoverZeroWidthSpaces(treeFocus);

  // Ensure note integrity.
  mergeIfNecessary(treeFocus);
  updateNoteBarriers(treeFocus);
  preventBrTags(treeFocus);
};
