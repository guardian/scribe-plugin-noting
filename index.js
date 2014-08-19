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


    // function traverse(tree, fn) {
    //     // Do not traverse text nodes
    //     if (isVNode(tree)) {
    //         var child = tree.children[0];
    //         while (child) {
    //             traverse(child, fn);
    //             fn(child);
    //             child = tree.children[tree.children.indexOf(child) + 1];
    //         }
    //     }

    //     return tree;
    // }

    function isNote (node) {
      return node.tagName === nodeName;
    }

    function noteWrap(content) {
      content = content || '';
      return h('gu:note', [content]);
    }

    noteCommand.execute = function () {
      console.log('noteCommand.execute')
      // var selection = new scribe.api.Selection();
      // var range = selection.range;
      // var cloned = range.cloneContents();
      // var tree = virtualize(scribe.el);

      var note = noteWrap();
      scribe.el.appendChild(createElement(note));

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

      console.log('here we are');
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
