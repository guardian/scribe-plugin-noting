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
    var h = require('virtual-dom/h');
    var createElement = require('virtual-dom/create-element');
    var _ = require('lodash');

    var isVNode = require('vtree/is-vnode');
    var isVText = require('vtree/is-vtext');

    //currently
    var tag = "gu:note";
    var nodeName = "GU:NOTE";
    var className = "note";
    var dataName = "data-edited-by";
    var dataDate = "data-edited-date";
    var blocks = ["P", "LI", "UL"];
    var noteCommand = new scribe.api.Command('insertHTML');

    function traverse(tree, fn) {
        // Do not traverse text nodes
        if (isVNode(tree)) {
            var child = tree.children[0];
            while (child) {
                traverse(child, fn);
                fn(child);
                child = tree.children[tree.children.indexOf(child) + 1];
            }
        } //else {
          //console.log('not vnode, is:', tree);
        //}

        return tree;
    }

    function walk(vnode, fn) {
      // this is a semi-recursive tree descent
      // although it's a shame it uses a loop
      // this could be trivially rewritten to be
      // fully recursive
      // this is far simpler than doing rubbish
      // with do whiles
      vnode.children && vnode.children.forEach(function(child) {
        walk(child, fn);
      });

      fn(vnode);
    }

    function getChildren(tree) {
      var children = [];
      walk(tree, function(el) {
        children.push(el);
      });
      return children;
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

    // function noteWrap(content) {
    //   content = content || 'Note text here';
    //   return h('gu:note.note', [content]);
    // }

    function wrapText(content) {
      //wrap the contents of a text node
      // they behave diffent
      var wrap = createWrap();
      content.textContent = content.textContent;
      wrap.appendChild(content);
      return wrap;
    }



    // Add start/end classes to markers.
    // function transformMarkers() {
    //   traverse(tree, function(el) {
    //     if (isScribeMarker(el)) {
    //       el.properties.class;
    //     }
    // }

    noteCommand.execute = function () {
      console.log('noteCommand.execute')
      var selection = new scribe.api.Selection();
      var range = selection.range;
      // console.log('selection', selection)
      // console.log('range', selection.range)



      // tree.children.map(function(el) {
      //   if (el.)
      // })
      // var firstNoteText = _(tree).flatten().rest(isScribeMarker).value();
      // console.log(firstNoteText);


      function dropBeforeMarker (vNodes) {
        return _.rest(vNodes, function (vNode) { return ! isScribeMarker(vNode); });
      }
      function takeBeforeMarker (vNodes) {
         return _.first(vNodes, function (vNode) { return ! isScribeMarker(vNode); });
      }

      function onlyTextNodes (vNodes) {
        function isVTextNode (vNode) { return vNode.type === 'VirtualText'; }

        return vNodes.filter(isVTextNode);
      }

      function findVTextNodesToWrap(vNodes) {
        var results;
        results = dropBeforeMarker(vNodes);
        console.log('dropBeforeMarker', results)
        results = _.rest(results); // remove first marker
        console.log('remove first marker', results)
        results = takeBeforeMarker(results); // take until end marker
        console.log('take until end marker', results)
        results = onlyTextNodes(results);
        console.log('onlyTextNodes', results)
        return results;
      }

      // Wrap node in a note.
      // node can be vNode or DOM node.
      function wrapInNote(node) {
        return h('gu:note.note', [node]);
      }

      // Place markers and create virtual trees
      selection.placeMarkers();
      var originalTree = virtualize(scribe.el);
      var tree = virtualize(scribe.el); // we'll mutate this one
      console.log('tree', tree);


      // We mutate references in this tree.
      var vNodes = getChildren(tree);
      console.log('vNodes', vNodes);
      var vTextNodesToWrap = findVTextNodesToWrap(vNodes);
      var wrappedTextNodes = vTextNodesToWrap.map(function (vTextNode) { return wrapInNote(vTextNode); });

      console.log('vTextNodesToWrap', vTextNodesToWrap);
      console.log('wrappedTextNodes', wrappedTextNodes);

      // DEBUG:
      window.tree = tree;
      window._ = _;
      window.vNodes = vNodes;
      //////////

      // Find wrapped version of vNode
      function locateWrapped(vNode, vTextNodesToWrap, wrappedTextNodes) {
        var index = vTextNodesToWrap.indexOf(vNode);
        return wrappedTextNodes[index];
      }

      // Now walk the tree to find the references to the nodes we wrapped,
      // and replace the references to point to our wrapped versions.
      // Note: If we could rewrite the code to use a zipper we might be able
      // to avoid this step.

      walk(tree, function (vNode) {
        if (vNode.children) {
          for (var i = vNode.children.length - 1; i >= 0; i--) {
              if (_.contains(vTextNodesToWrap, vNode.children[i])) {
                vNode.children[i] = locateWrapped(vNode.children[i], vTextNodesToWrap, wrappedTextNodes);
              }
          }
        }
      });
      console.log('modified tree', tree);
      // Then diff with the original tree and patch the DOM. And we're done.
      var patches = diff(originalTree, tree);
      console.log('patches', patches)
      patch(scribe.el, patches);
      console.log('scribe.el', scribe.el);

      // TODO: Remove markers and place caret at appropriate place
      // TODO 2: IDs to identify nodes

      // var vNote = h('gu:note.note', []);
      // var note = noteWrap(selection.range);
      // selection.range.insertNode(range.surroundContents(createElement(vNote)));


      // if the selection is the whole line, then we need to note the whole line
      // if it isn't then we just do the bit selected and nothing else.
      // selection.selection.data currently will duplicate things if there is no
      // actual selection

      // if(! selection.selection.isCollapsed) {
      //   if (this.queryState()) {
      //     if (!hasBlockElements(cloned)) {
      //       basicUnwrap(selection, range);
      //     } else {
      //       descentUnwrap(selection, range);
      //     }
      //   } else {
      //     // check if the selection has block elements.
      //     // if it does do the complex version,
      //     // otherwise do the simple version
      //     if (!hasBlockElements(cloned)) {
      //       var wrapped = wrapRange(cloned);
      //       range.deleteContents();
      //       range.insertNode(wrapped);
      //     } else {
      //       wrapBlocks(selection, range);
      //     }
      //   }
      // }

    };


      noteCommand.queryState = function () {
        console.log('noteCommand.queryState')
        // TODO: The instance in which there are more scribe nodes
        // clone the range and see if there are spans in it
        var selection = new scribe.api.Selection();
        var scribeEls = selection.range.cloneContents().querySelectorAll('.note');
        var containsNote = function (scribeEls) {
          for (var i = 0, len = scribeEls.length; i < len; i++) {
            if (isNote(scribeEls[i])) {
              return true;
            }
          }
        };

        // check if there is a note in the selection
        var isNode = !!selection.getContaining(function (node) {
          return isNote(node);
        });

        return isNode || containsNote(scribeEls);

      };

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
