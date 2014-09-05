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
    var _ = require('lodash');


    var tag = "gu:note";
    var nodeName = "GU:NOTE";
    var className = "note";
    var dataName = "data-edited-by";
    var dataDate = "data-edited-date";
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
      return ! !!this.parent;
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
        this.vNode = replacementVNode;
      } else {
        var vNodeIndex = this.parent.vNode.children.indexOf(this.vNode);
        this.parent.vNode.children.splice(vNodeIndex, 1, replacementVNode);
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

    function focusOnNote(fNote) {
      return isNote(fNote.vNode);
    }

    // Whether a DOM node or vNode is a note.
    // Case insensitive to work with both DOM nodes and vNodes
    // (which can be lowercase).
    function isNote(node) {
      return node.tagName && node.tagName.toLowerCase() === nodeName.toLowerCase();
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
      function stillWithinNote(focus) {
        console.log('got focus on', focus.vNode)
        return !focusOnVTextNode(focus) || findAncestorVNoteSegment(focus);
      }

      return _.last(
        fNoteSegment.takeWhile(stillWithinNote, 'prev').filter(focusOnNote)
      );
    }

    // Find the rest of a note.
    // We identify notes based on 'adjacency' rather than giving them an id.
    // This is because people may copy and paste part of a note. We don't want
    // that to keep being the same note.
    // fNoteSegment: focus on note
    function findEntireNote(fNoteSegment) {
      function stillWithinNote(focus) {
        return !focusOnVTextNode(focus) || findAncestorVNoteSegment(focus);
      }

      return findFirstNoteSegment(fNoteSegment)
        .takeWhile(stillWithinNote).filter(focusOnNote);
    }

    function onlyTextNodes (focuses) {
      return focuses.filter(focusOnVTextNode);
    }


    /**
    * Noting: Create, remove, wrap etc.
    */

    // Wrap in a note.
    // toWrap can be a vNode, DOM node or a string. One or an array with several.
    function wrapInNote(toWrap, noteIdValue) {
      var nodes = toWrap instanceof Array ? toWrap : [toWrap];

      var note = h('gu:note.note', {dataset: {noteId: noteIdValue}}, nodes);
      return note;
    }

    function createVirtualScribeMarker() {
      return h('em.scribe-marker', []);
    }

    function removeVirtualScribeMarkers(treeFocus) {
      treeFocus.forEach(function(focus) {
        if (isScribeMarker(focus.vNode)) focus.remove();
      });
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
        return node.tagName === 'GU:NOTE';
      });
    }


    /**
    * Noting: Other helpers
    */

    function generateUUID(){
      var d = new Date().getTime();
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = (d + Math.random()*16)%16 | 0;
          d = Math.floor(d/16);
          return (c=='x' ? r : (r&0x7|0x8)).toString(16);
      });
      return uuid;
    };


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
      var replacementVNode = wrapInNote([zeroWidthSpace, createVirtualScribeMarker()], generateUUID());

      // We assume there's only one marker.
      var marker = findMarkers(treeFocus)[0];

      marker.replace(replacementVNode);
    }

    // treeFocus: tree focus of tree containing two scribe markers
    // Note that we will mutate the tree.
    function createNoteFromSelection(treeFocus) {
      // Leaning towards not using ids for identification and instead define a note
      // as: note segments adjacent to each other. Or we'll have to reset ids
      // frequently. But keeping the ids for now.
      var noteId = generateUUID();

      // Wrap wrap
      var vTextNodesToWrap = findVTextNodesBetweenMarkers(treeFocus);
      var wrappedTextNodes = vTextNodesToWrap.map(function (focus) {
        var wrappedVNode = wrapInNote(focus.vNode, noteId);
        return focus.replace(wrappedVNode);
      });

      removeVirtualScribeMarkers(treeFocus);

      return noteId;
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
        unnote(treeFocus, note.dataset.noteId);

        // Then diff with the original tree and patch the DOM. And we're done.
        var patches = diff(originalTree, tree);
        patch(scribe.el, patches);


      } else if (selection.selection.isCollapsed) {
        createEmptyNoteAtCaret(treeFocus);

        // Then diff with the original tree and patch the DOM. And we're done.
        var patches = diff(originalTree, tree);
        patch(scribe.el, patches);

        // Place caret (necessary to do this explicitly for FF).
        selection.selectMarkers();
      } else {
        createNoteFromSelection(treeFocus);

        // Then diff with the original tree and patch the DOM. And we're done.
        var patches = diff(originalTree, tree);
        patch(scribe.el, patches);

        // TODO: Place caret at appropriate place
      }

      // We need to make sure we remove markers when we're done, as our functions assume there's
      // either one or two markers present.
      selection.removeMarkers();

      // Keeping for debugging for the moment
      window.ftree = new VFocus(tree);
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
