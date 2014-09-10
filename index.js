/*
 * Plugin for adding a <note> elements around
 * things.
 */

module.exports = function(user) {
  return function(scribe) {
    /**
    * Imports and config
    */

    var diff = require('virtual-dom/diff');
    var patch = require('virtual-dom/patch');

    // There was a bug in vdom-virtualize that caused data attributes not
    // to be virtualized. Have fixed this and got it merged upstream.
    // No new release yet, however, so have specified the specific commit as
    // dependency. Feel free to update to future versions when they're released.
    var virtualize = require('vdom-virtualize');

    var h = require('virtual-hyperscript');
    var createElement = require('virtual-dom/create-element');
    var isVNode = require('vtree/is-vnode');
    var isVText = require('vtree/is-vtext');
    var VText = require('vtree/vtext');
    var _ = require('lodash');


    var TAG = "gu:note";
    var NODE_NAME = "GU:NOTE";
    var CLASS_NAME = "note";
    var DATA_NAME = "data-node-edited-by";
    var DATA_NAME_CAMEL = "noteEditedBy";
    var DATA_DATE = "data-note-edited-date";
    var DATA_DATE_CAMEL = "noteEditedDate";

    var blocks = ["P", "LI", "UL"];
    var noteCommand = new scribe.api.Command('insertHTML');


    /**
    * VFocus: Wrap virtual node in a Focus node.

      Makes it possible to move around as you wish in the tree.

      vNode: the vNode to focus on
      parent: parent vFocus
    */
    function VFocus(vNode, parent) {
      // Don't change these references pretty please
      this.vNode = vNode;
      this.parent = parent;
    }

    /**
    * Internally useful
    */

    VFocus.prototype.rightVNode = function() {
      if (this.isRoot()) return null;

      var rightVNodeIndex = this.parent.vNode.children.indexOf(this.vNode) + 1;
      return this.parent.vNode.children[rightVNodeIndex];
    };

    VFocus.prototype.leftVNode = function() {
      if (this.isRoot()) return null;

      var leftVNodeIndex = this.parent.vNode.children.indexOf(this.vNode) - 1;
      return leftVNodeIndex >= 0 ? this.parent.vNode.children[leftVNodeIndex] : null;
    };


    /**
    * Checks
    */

    VFocus.prototype.isRoot = function() {
      return ! this.parent;
    };

    VFocus.prototype.canRight = function() {
      return !!this.rightVNode();
    };

    VFocus.prototype.canLeft = function() {
      return !!this.leftVNode();
    };

    VFocus.prototype.canDown = function() {
      return this.vNode.children && this.vNode.children.length ? true : false;
    };

    VFocus.prototype.canUp = function() {
      return ! this.isRoot();
    };


    /**
    * Movements
    */

    // Focus next (pre-order)
    VFocus.prototype.next = function() {
      function upThenRightWhenPossible(vFocus) {
        // Terminate if we've visited all nodes.
        if (vFocus === null) return null;

        return vFocus.right() || upThenRightWhenPossible(vFocus.up());
      }

      return this.down() || this.right() || upThenRightWhenPossible(this.up());
    };

    // Focus previous (pre-order)
    VFocus.prototype.prev = function() {
      function downFurthestRight(vFocus) {
        function furthestRight(vFocus) {
          var focus = vFocus;
          while (focus.canRight()) { focus = focus.right(); }
          return focus;
        }

        return vFocus.canDown() ? downFurthestRight(vFocus.down()) : furthestRight(vFocus);
      }

      var focus;
      if (this.left() && this.left().down()) {
        focus = downFurthestRight(this.left());
      } else if (this.left()) {
        focus = this.left();
      } else {
        focus = this.up();
      }

      return focus;
    };

    // Focus first child
    VFocus.prototype.down = function() {
      if (! this.canDown()) return null;

      return new VFocus(this.vNode.children[0], this);
    };

    // Focus parent
    VFocus.prototype.up = function() {
      if (! this.canUp()) return null;

      return this.parent;
    };

    // Focus node to the right (on the same level)
    VFocus.prototype.right = function() {
      if (! this.canRight()) return null;

      return new VFocus(this.rightVNode(), this.parent);
    };

    // Focus node to the left (on the same level)
    VFocus.prototype.left = function() {
      if (! this.canLeft()) return null;

      return new VFocus(this.leftVNode(), this.parent);
    };

    VFocus.prototype.top = function() {
      return this.canUp() ? this.parent.top() : this;
    };


    /**
    * Mutating operations
    */

    // Replace `this.vNode` and return `this` to enable chaining.
    // Note that this mutates the tree.
    VFocus.prototype.replace = function(replacementVNode) {
      if (this.isRoot()) {
        // Replace and focus on the replacement.
        this.vNode = replacementVNode;
      } else {
        // Replace the object in the tree we're focusing on.
        var vNodeIndex = this.parent.vNode.children.indexOf(this.vNode);
        this.parent.vNode.children.splice(vNodeIndex, 1, replacementVNode);

        // And focus on the replacement.
        this.vNode = replacementVNode;
      }

      return this;
    };

    // Remove `this.vNode`, i.e. remove the reference from the tree.
    VFocus.prototype.remove = function() {
      if (this.isRoot()) {
        // No can do. Should maybe raise an exception.
      } else {
        var vNodeIndex = this.parent.vNode.children.indexOf(this.vNode);
        this.parent.vNode.children.splice(vNodeIndex, 1);
      }

      return this;
    };

    VFocus.prototype.insertAfter = function(newVNodes) {
      var newVNodes = newVNodes instanceof Array ? newVNodes : [newVNodes];

      if (this.isRoot()) {
        // No can do. Should maybe raise an exception.
      } else {
        var siblings = this.parent.vNode.children;
        var vNodeIndex = siblings.indexOf(this.vNode);

        if (siblings.length === vNodeIndex + 1) {
          // Last element of array
          siblings = siblings.concat(newVNodes);
        } else {
          // Insert before the next sibling.
          newVNodes.reverse().forEach(function (vNode) {
            siblings.splice(vNodeIndex + 1, 0, vNode);
          });
        }
      }

      return this;
    };

    /**
    * Iteration methods
    */

    VFocus.prototype.forEach = function(fn) {
      var node = this;
      while (node) {
        fn(node);
        node = node.next();
      }
    };

    // Flatten `this` and all nodes after, returning a list
    VFocus.prototype.flatten = function(replacementVNode) {
      var focuses = [];
      this.forEach(function(focus) { focuses.push(focus); });

      return focuses;
    };

    // Take while condition is true. Return list.
    // predicate: function that receives the current item
    //       and returns true/false.
    VFocus.prototype.takeWhile = function(predicate, movement) {
      var movement = movement || 'next';

      var focus = this;
      var acc = [];
      while (predicate(focus)) {
        acc.push(focus);
        focus = focus[movement]();
        if (! focus[movement]()) break;
      }
      return acc;
    };

    VFocus.prototype.filter = function(predicate, movement) {
      var movement = movement || 'next';

      var results = [];
      this.forEach(function(focus) {
        if (predicate(focus)) results.push(focus);
      }, movement);

      return results;
    };

    // Find focus satisfying predicate.
    // predicate: function that takes a focus and returns true/false.
    // movement: string name of one of the movement functions, e.g. 'up' or 'prev'.
    // If nothing is found null is returned (as we step off the tree).
    VFocus.prototype.find = function(predicate, movement) {
      var movement = movement || 'next';
      var focus = this;

      while (focus) {
        if (predicate(focus)) break;
        focus = focus[movement]();
      }

      return focus;
    }

    /* ***** End VFocus ***** /*


    /**
    * Noting: Checks
    */

    function focusOnMarker(focus) {
      return isScribeMarker(focus.vNode);
    }

    function focusOnVTextNode (focus) {
      return focus.vNode.type === 'VirtualText';
    }

    function focusOnNote(focus) {
      return isNote(focus.vNode);
    }

    function focusOnEmptyTextNode(focus) {
      // We consider zero width spaces as empty.
      function consideredEmpty(s) {
        return s === '' || s === '\u200B';
      }
      var vNode = focus.vNode;
      return isVText(vNode) && consideredEmpty(vNode.text);
    }

    // Whether a DOM node or vNode is a note.
    // Case insensitive to work with both DOM nodes and vNodes
    // (which can be lowercase).
    function isNote(node) {
      return node.tagName && node.tagName.toLowerCase() === TAG;
    }

    function isScribeMarker(vNode) {
       return hasClass(vNode, "scribe-marker");
    }

    // Check if VNode has class
    function hasClass(vNode, value) {
      return (vNode.properties &&
        vNode.properties.className &&
        vNode.properties.className === value);
    }

    function stillWithinNote(focus) {
        return !focusOnVTextNode(focus) || focusOnEmptyTextNode(focus) || findAncestorVNoteSegment(focus);
    }


    /**
    * Noting: Finders and filters
    */

    function findAncestorVNoteSegment(fNote) {
      return fNote.find(focusOnNote, 'up');
    }

    function findVTextNodesBetweenMarkers(focusTree) {
      function focusNotOnMarker(focus) {
        return ! focusOnMarker(focus);
      }

      return onlyTextNodes(
        focusTree.find(focusOnMarker).next().takeWhile(focusNotOnMarker)
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
    // fNoteSegment: focus on note
    function findEntireNote(fNoteSegment) {
      return findFirstNoteSegment(fNoteSegment)
        .takeWhile(stillWithinNote).filter(focusOnNote);
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

    function onlyTextNodes (focuses) {
      return focuses.filter(focusOnVTextNode);
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

    // Ensure the first (and only the first) note segment has a
    // `data-note-start` attribute and that the last (and only the last)
    // note segment has a `data-note-end` attribute.
    function updateStartAndEndAttributes(noteSegments) {
      function addStartAndEndAttributes(noteSegments) {
        noteSegments[0].vNode.properties.dataset['noteStart'] = '';
        noteSegments[noteSegments.length - 1].vNode.properties.dataset['noteEnd'] = '';
      }

      function removeStartAndEndAttributes(noteSegments) {
        noteSegments.forEach(function(noteSegment) {
          var vNode = noteSegment.vNode;

          // What we'd like to do...
          // delete vNode.properties.dataset['noteStart'];
          // delete vNode.properties.dataset['noteEnd'];

          // What we hackily have to do...
          noteSegments[0].vNode.properties.dataset = {};
          noteSegments[noteSegments.length - 1].vNode.properties.dataset = {};

          // When we use `delete` we end up with an HTML attribute with
          // `data-note-start="undefined" data-note-end="undefined"`.
          // I suspect a bug in `virtual-dom/patch`.
          //
          // The workaround is obviously not ideal since it makes the code
          // more dependent on which order we add attributes.
          //
          // TODO: Investigate the cause of this.
        });
      }
      // Actually removes all attributes atm. See comment within.
      removeStartAndEndAttributes(noteSegments);

      addStartAndEndAttributes(noteSegments);
    }

    function userAndTimeAsDatasetAttrs() {
      var dataset = {}
      dataset[DATA_NAME_CAMEL] = user;
      dataset[DATA_DATE_CAMEL] = new Date().toISOString(); // how deal with timezone?

      return dataset;
    }

    function createVirtualScribeMarker() {
      return h('em.scribe-marker', []);
    }

    function createNoteBarrier() {
      return h('span.note-barrier', '\u200B');
    }

    function removeVirtualScribeMarkers(treeFocus) {
      treeFocus.forEach(function(focus) {
        if (isScribeMarker(focus.vNode)) focus.remove();
      });
    }

    function updateEditedBy(noteSegment) {
      var dataset = userAndTimeAsDatasetAttrs();
      noteSegment.vNode.properties.dataset[DATA_NAME_CAMEL] = dataset[DATA_NAME_CAMEL];
      noteSegment.vNode.properties.dataset[DATA_DATE_CAMEL] = dataset[DATA_DATE_CAMEL];
    }


    /**
     * Noting: Operations on the real DOM
     */

    // Walk up the (real) DOM checking isTargetNode.
    function domWalkUpFind(node, isTargetNode) {
      if (!node.parentNode) { return false; }

      return isTargetNode(node) ? node : domWalkUpFind(node.parentNode, isTargetNode);
    }

    // Return the note our selection is inside of, if we are inside one.
    function domFindAncestorNote() {
      var node = window.getSelection().getRangeAt(0).startContainer;

      return domWalkUpFind(node, function(node) {
        return node.tagName === NODE_NAME;
      });
    }

    // Remove all scribe markers from the DOM.
    //
    // Note: It's not enough to use selection.removeMarkers since we place
    // markers outside of the selection to achieve correct caret positioning.
    function domRemoveMarkers() {
      var markers = _.toArray(document.querySelectorAll('.scribe-marker'));

      markers.forEach(function (marker) {
        marker.parentNode.removeChild(marker);
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

      // "Merge" with any adjacent note (update edited by and update start and end attributes)
      var noteSegments = findEntireNote(marker);
      updateStartAndEndAttributes(noteSegments);
      noteSegments.forEach(updateEditedBy);
    }

    // treeFocus: tree focus of tree containing two scribe markers
    // Note that we will mutate the tree.
    function createNoteFromSelection(treeFocus) {
      var toWrapAndReplace = findVTextNodesBetweenMarkers(treeFocus);
      var userAndTime = userAndTimeAsDatasetAttrs();
      var wrappedTextNodes = toWrapAndReplace.map(function (focus) {
        return wrapInNote(focus.vNode, userAndTime);
      });

      _.zip(toWrapAndReplace, wrappedTextNodes).forEach(function(focusAndReplacementVNode) {
        var focus = focusAndReplacementVNode[0];
        var replacementVNode = focusAndReplacementVNode[1];

        focus.replace(replacementVNode);
      });

      removeVirtualScribeMarkers(treeFocus);

      // Place marker so the caret will be after the note.
      // TODO: Think of a proper solution instead of using this "element in between" hack.
      //       Chrome has a bug which means it doesn't place the caret
      //       outside the note.
      //
      //       Also, being able to step in and out of notes might need a solution
      //       like this, but where we somehow always maintain one zero-space
      //       element at the beginning and end of each note.
      var lastNoteSegment = findLastNoteSegment(toWrapAndReplace[0]);
      lastNoteSegment.insertAfter([createNoteBarrier(), createVirtualScribeMarker()]);

      // "Merge" with any adjacent note (update edited by and update start and end attributes)
      var noteSegments = findEntireNote(lastNoteSegment);
      updateStartAndEndAttributes(noteSegments);
      noteSegments.forEach(updateEditedBy);
    }

    function unnote(treeFocus) {
      function unwrap(focus) {
        var note = focus.vNode;
        var noteContents = note.children;
        var indexOfNode = focus.parent.vNode.children.indexOf(note);
        focus.parent.vNode.children.splice(indexOfNode, 1, noteContents); // replace note
        focus.parent.vNode.children = _.flatten(focus.parent.vNode.children);
      }

      // We assume the caller knows there's only one marker.
      var marker = findMarkers(treeFocus)[0];

      var noteSegment = findAncestorVNoteSegment(marker);
      var noteSegments = findEntireNote(noteSegment);

      noteSegments.forEach(unwrap);

      // The marker is where we want it to be (the same position) so we'll
      // just leave it.
    }


    /**
    * The note command
    */

    noteCommand.execute = function () {
      var selection = new scribe.api.Selection();

      // Place markers and create virtual trees.
      // We'll use the markers to determine where a selection starts and ends.
      selection.placeMarkers();
      var originalTree = virtualize(scribe.el);
      var tree = virtualize(scribe.el); // we'll mutate this one
      var treeFocus = new VFocus(tree);
      var note = domFindAncestorNote(selection); // if we're inside of a note we want to know

      if (selection.selection.isCollapsed && note) {
        unnote(treeFocus);
      } else if (selection.selection.isCollapsed) {
        createEmptyNoteAtCaret(treeFocus);
      } else {
        createNoteFromSelection(treeFocus);
      }

      // Then diff with the original tree and patch the DOM.
      var patches = diff(originalTree, tree);
      patch(scribe.el, patches);

      // Place caret (necessary to do this explicitly for FF).
      selection.selectMarkers();

      // We need to make sure we clean up after ourselves by removing markers
      // when we're done, as our functions assume there's either one or two
      // markers present.
      domRemoveMarkers();

      window.ftree = treeFocus;
      window.findAllNotes = findAllNotes;
    };


      noteCommand.queryState = function () {
        // NOT IMPLEMENTED: Return true if selection is inside note or contains a note.
      };

      scribe.commands.note = noteCommand;

      scribe.el.addEventListener('keydown', function (event) {
        //that's F10 and F8 and alt+del
        if (event.keyCode === 121 ||event.keyCode === 119) {
          event.preventDefault();
          var noteCommand = scribe.getCommand("note");
          noteCommand.execute();
        }
      ;});
  }
}
