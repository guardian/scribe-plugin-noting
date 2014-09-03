/*
 * Plugin for adding a <note> elements around
 * things.
 */

module.exports = function(user) {
  return function(scribe) {
    /* global window, require */
    var diff = require('virtual-dom/diff');
    var patch = require('virtual-dom/patch');
    var virtualize = require('vdom-virtualize');
    var h = require('virtual-hyperscript');
    var createElement = require('virtual-dom/create-element');
    var isVNode = require('vtree/is-vnode');
    var isVText = require('vtree/is-vtext');

    var _ = require('lodash');

    //currently
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

    VFocus.prototype.canUp = function() {
      return ! this.isRoot();
    };

    VFocus.prototype.canDown = function() {
      return this.vNode.children && this.vNode.children.length ? true : false;
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
    * Traverse
    */

    VFocus.prototype.forEach = function(fn) {
      var node = this;
      while (node) {
        fn(node);
        node = node.next();
      }
    };


    /**
    * Mutable operations
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
    * Immutable transformations
    */

    // Flatten `this` and all nodes after, returning a list
    VFocus.prototype.flatten = function(replacementVNode) {
      var focuses = [];
      this.forEach(function(focus) { focuses.push(focus); });

      return focuses;
    };



    function walk(vnode, fn) {
      // this is a semi-recursive tree descent
      // although it's a shame it uses a loop
      // this could be trivially rewritten to be
      // fully recursive
      // this is far simpler than doing rubbish
      // with do whiles
      vnode && vnode.children && vnode.children.forEach(function(child) {
        walk(child, fn);
      });

      fn(vnode);
    }

    function flattenVTree(tree) {
      var vNodes = [];
      walk(tree, function(vNode) {
        vNodes.push(vNode);
      });
      return vNodes;
    }

    function isScribeMarker(node) {
       return hasClass(node, "scribe-marker");
    }

    function unlessScribeMarker(node) {
      return ! isScribeMarker(node);
    }

    // Check if VNode has class
    function hasClass(vnode, value) {
      return (vnode.properties &&
        vnode.properties.className &&
        vnode.properties.className === value);
    }

    function isNote(node) {
      return node.tagName === nodeName;
    }

    function dropBeforeMarker (focuses) {
      return _.rest(focuses, function (focus) { return unlessScribeMarker(focus.vNode); });
    }

    function takeBeforeMarker (focuses) {
       return _.first(focuses, function (focus) { return unlessScribeMarker(focus.vNode); });
    }

    function onlyTextNodes (focuses) {
      function isVTextNode (focus) { return focus.vNode.type === 'VirtualText'; }

      return focuses.filter(isVTextNode);
    }

    function findVTextNodesToWrap(focuses) {
      function selectBetweenMarkers() {
        var results;
        results = dropBeforeMarker(focuses);
        results = _.rest(results); // remove first marker
        results = takeBeforeMarker(results); // take until end marker
        return results;
      }

      return onlyTextNodes(selectBetweenMarkers());
    }

    function generateUUID(){
      var d = new Date().getTime();
      var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = (d + Math.random()*16)%16 | 0;
          d = Math.floor(d/16);
          return (c=='x' ? r : (r&0x7|0x8)).toString(16);
      });
      return uuid;
    };

    // Wrap in a note.
    // nodeOrText can be a vNode, DOM node or a string.
    function wrapInNote(nodeOrText, noteIdValue) {
      var note = h('gu:note.note', {dataset: {noteId: noteIdValue}}, [nodeOrText]);
      return note;
    }

    // Assumes there's only one marker.
    // Replaces marker with newVNode, and then inserts the marker
    // inside newVNode.
    function insertAtMarker(vTree, newVNode) {
      walk(vTree, function (vNode) {
        if (! vNode.children) { return; }

        for (var i = vNode.children.length - 1; i >= 0; i--) {
          if (isScribeMarker(vNode.children[i])) {
            var marker = vNode.children[i];
            vNode.children[i] = newVNode;
            newVNode.children.push(marker);
          }
        }
      });
    }


    /**
    * Note creation
    */

    // tree - tree containing a marker.
    // Note that we will mutate the tree.
    function createEmptyNoteAtCaret(tree) {
      // We need a zero width space character to make the note selectable.
      var zeroWidthSpace = '\u200B';

      insertAtMarker(tree, wrapInNote(zeroWidthSpace, generateUUID()));
    }

    // treeFocus -- tree focus of tree containing two scribe markers
    // Note that we will mutate the tree.
    function createNoteFromSelection(treeFocus) {
      var fNodes = treeFocus.flatten();

      var noteId = generateUUID();

      // Wrap wrap
      var vTextNodesToWrap = findVTextNodesToWrap(fNodes);
      var wrappedTextNodes = vTextNodesToWrap.map(function (focus) {
        var wrappedVNode = wrapInNote(focus.vNode, noteId);
        return focus.replace(wrappedVNode);
      });

      removeVirtualScribeMarkers(treeFocus);
      // placeCaretAfterNote(tree, noteId);

      return noteId;
    }

    // Walk up the dom checking isTargetNode.
    function domWalkUpFind(node, isTargetNode) {
      if (!node.parentNode) { return false; }

      return isTargetNode(node) ? node : domWalkUpFind(node.parentNode, isTargetNode);
    }

    // Checks whether our selection is within another note.
    function insideNote() {
      var node = window.getSelection().getRangeAt(0).startContainer;

      return domWalkUpFind(node, function(node) {
        return node.tagName === 'GU:NOTE';
      });
    }

    function removeVirtualScribeMarkers(treeFocus) {
      treeFocus.forEach(function(focus) {
        if (isScribeMarker(focus.vNode)) focus.remove();
      });
    }

    // Assumes note has been placed in the tree
    function placeCaretAfterNote(tree, noteId) {
      function findVNodeAfterNote(tree, noteId) {
        var vNodeAfterNote;
        var noteFound;
        var done;
        console.log(tree)
        walk(tree, function(vNode) {
          if (done) { return; }
          console.log('not done, got node', vNode);
          // && vNode.properties.dataset.noteId === noteId
          if (isNote(vNode)) {
            console.log('note found');
            noteFound = true;
          }

          if (noteFound && !isNote(vNode)) {
            console.log('note found and no note')
            done = true;
            vNodeAfterNote = vNode;
          }

          return vNodeAfterNote;
        });
      }

      var virtualScribeMarker = h('em.scribe-marker', []);
      var vNodeAfterNote = findVNodeAfterNote(tree, noteId);
      console.log('vNodeAfterNote', vNodeAfterNote);
      vNodeAfterNote.children.push(virtualScribeMarker);
    }

    // Unnote a note by replacing it with its unwrapped contents.
    function unnote(tree, noteId) {
      walk(tree, function (vNode) {
        if (! vNode.children) { return; }

        for (var i = vNode.children.length - 1; i >= 0; i--) {
            if (isNote(vNode.children[i])) {
              var note = vNode.children[i];
              var noteContents = note.children;
              vNode.children.splice(i, 1, noteContents); // replace note
              vNode.children = _.flatten(vNode.children);
            }
        }
      });
    }

    noteCommand.execute = function () {
      var selection = new scribe.api.Selection();

      // Place markers and create virtual trees.
      // We'll use the markers to determine where a selection starts and ends.
      selection.placeMarkers();
      var originalTree = virtualize(scribe.el);
      var tree = virtualize(scribe.el); // we'll mutate this one
      var treeFocus = new VFocus(tree);
      var note = insideNote(selection); // if we're inside of a note we want to know

      if (selection.selection.isCollapsed && note) {
        unnote(tree, note.dataset.noteId);

        // Then diff with the original tree and patch the DOM. And we're done.
        var patches = diff(originalTree, tree);
        patch(scribe.el, patches);


      } else if (selection.selection.isCollapsed) {
        createEmptyNoteAtCaret(tree);

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

        // Place caret
        // TODO: Remove markers and place caret at appropriate place
        window.focus = new VFocus(tree);
        window.befFocus = new VFocus(originalTree);
      }

      // We need to make sure we remove markers when we're done, as our functions assume there's
      // either one or two markers present.
      selection.removeMarkers();
    };


      // noteCommand.queryState = function () {
      //   console.log('noteCommand.queryState')
      //   // TODO: The instance in which there are more scribe nodes
      //   // clone the range and see if there are spans in it
      //   var selection = new scribe.api.Selection();
      //   var scribeEls = selection.range.cloneContents().querySelectorAll('.note');
      //   var containsNote = function (scribeEls) {
      //     for (var i = 0, len = scribeEls.length; i < len; i++) {
      //       if (isNote(scribeEls[i])) {
      //         return true;
      //       }
      //     }
      //   };

      //   // check if there is a note in the selection
      //   var isNode = !!selection.getContaining(function (node) {
      //     return isNote(node);
      //   });

      //   return isNode || containsNote(scribeEls);

      // };

      scribe.commands.note = noteCommand;

      scribe.el.addEventListener('keydown', function (event) {
        //that's F10 and F8 and alt+del
        if (event.keyCode === 121 ||event.keyCode === 119) {
          event.preventDefault();
          var noteCommand = scribe.getCommand("note");
          noteCommand.execute();
        }
      });
  }
}
