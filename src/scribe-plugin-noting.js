define(function () {

  /*
   * Plugin for adding a <note> elements around
   * things.
   */

  'use strict';

  return function (user) {
    return function(scribe) {

      //currently
      var tag = "span";
      var nodeName = "SPAN";
      var className = "note";
      var blocks = ["P", "LI", "UL"];

      var noteCommand = new scribe.api.Command('insertHTML');


      function createWrap() {
        var wrap = document.createElement(tag);
        wrap.className = className;
        var date = new Date().getTime().toString();
        wrap.setAttribute("data-edited", user + " " + date);
        return wrap;

      }

      function wrapText(content) {
        //wrap the contents of a text node
        // they behave diffent
        var wrap = createWrap();
        wrap.appendChild(content);
        return wrap;
      }

      function wrapBlock(block) {
        // for this one we need to get the text
        // inside as the clone will wrap this in a p and
        // we'll have to do more magic. So we append the
        // wrap to the element inside the block
        // there are some issues with LIs and Bs at the moment
        var wrap = createWrap(wrap);
        var temp = block.cloneNode(true);
        wrap.innerHTML = temp.innerHTML;
        temp.appendChild(wrap);
        return temp;
      }

      function wrapRange(range, wrap) {
        var temp = document.createDocumentFragment();
        var childNodes = range.childNodes;

        childNodes = Array.prototype.slice.call(childNodes);

        childNodes.forEach(function (item) {
          var tempNode;

          if (!item) {
            return;
          }

          if(item.nodeType === Node.TEXT_NODE) {
            // this is for a basic selection
            tempNode = wrapText(item, wrap);
          } else {
            tempNode = wrapBlock(item, wrap);
          }

          temp.appendChild(tempNode);
        });

        return temp;
      }

      function hasBlockElements (range) {
        for (var i = 0, len = range.childNodes.length; i < len; i++) {
          if(blocks.indexOf(range.childNodes[i].nodeName) !== -1) {
            return true;
          }
          return false;
        }
      }

      function checkScribeMarker (node) {
        return (' ' + node.className + ' ').indexOf(' ' + "scribe-marker" + ' ') > -1;
      }

      function isNote (node) {
        return (' ' + node.className + ' ').indexOf(' ' + "note" + ' ') > -1;
      }

      function findScribeMarker(node) {
        if (checkScribeMarker(node)) {
          // the passed node could also be the marker
          return 1;
        }

        for(var i = 0, len = node.childNodes.length; i < len; i++) {
          if(checkScribeMarker(node.childNodes[i])) {
            return i;
          }
        }
        return -1;
      };



      function walk(node, func) {
        // this is a semi-recursive tree descent
        // although it's a shame it uses a loop
        // this could be trivially rewritten to be
        // fully recursive
        // this is far simpler than doing rubbish
        // with do whiles
        var children = node.childNodes;

        for (var i = 0; i < children.length; i++) {
          walk(children[i], func);
        }

        func(node);
      }


      function removeScribeMarkers (tree) {
        walk(tree, function (node) {
          if (checkScribeMarker(node)) {
            node.parentElement.removeChild(node);
          }
        });
      }

      function unwrap (element) {
        // get the innercontent and move it in place of the element
        // TODO: Only does a basic unwrap - does not do the inner
        // elements
        var innerNode = element.firstChild;
        var parent = element.parentNode;
        parent.replaceChild(innerNode, element);
      }

      function getScribeMarker(arr) {
        for (var i = 0, len = arr.length; i < len; i++) {
          var el = arr[i];
          if(checkScribeMarker(arr[i])) {
            return i;
          }
        }
        return -1;
      }

      function buildNodeList (tree, predicate) {
        // walk a tree and build a list of nodes that need to be wrapped
        var scribeMarkerLocated = false;
        var done = false;
        var nodeList = [];
        walk(tree, function (node) {

          if (done === true) {
            return; //do nothing
          }


          if (checkScribeMarker(node)) {
            // begin pushing elements
            if (scribeMarkerLocated === true) {
              done = true;
            } else {
              scribeMarkerLocated = true;
            }
          }

          if (!done && scribeMarkerLocated && predicate(node)) {
            //scribe markers do not get pushed
            nodeList.push(node);
          }

        });
        return nodeList;
      }



      /*
       * This wraps all elements that contain block elements
       * in a note class.
       */
      function wrapBlocks (selection, range) {

        // drop markers so we can operate on all the sub elements in the selection
        selection.placeMarkers();
        selection.selectMarkers(true);

        var commonAncestor = range.commonAncestorContainer;

        var nodes = buildNodeList(commonAncestor, function (node) {
          return !checkScribeMarker(node)
            && (getScribeMarker(node.childNodes) === -1);
        });


        nodes.forEach(function (item, index, array) {
          if (!item) {
            return;
          }

          var wrap;
          var parent = item.parentNode;
          var sibling = item.nextSibling;

          if (item.nodeType === Node.TEXT_NODE) {
            // this is for a basic selection
            wrap = wrapText(item);
          } else {
            wrap =  wrapBlock(item);
          }

          // replace directly on the tree
          if (sibling) {
            parent.insertBefore(wrap, sibling);
          } else {
            parent.appendChild(wrap);
          }

        });
        selection.selectMarkers();
      }


      function iteratorWalk (commonAncestor, predicate) {
        /*
         * Basic algorithm
         * Walk the DOM
         * Find first scribe marker
         * Wrap every element
         * Find last scribe marker
         * Return
         */

        var nodeIterator = document.createNodeIterator(commonAncestor, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
        var nodeList = [];
        var done = false;
        var scribeMarkerLocated = false;




        var node = nodeIterator.nextNode(); //skip the first element
        while (node = nodeIterator.nextNode()) {
          // when the count is 0 return

          if (done === true) {
            return; //do nothing
          }

          if (checkScribeMarker(node)) {
            // begin pushing elements
            if (scribeMarkerLocated === true) {
              done = true;
            } else {
              scribeMarkerLocated = true;
            }
          }

          if (!done && scribeMarkerLocated && predicate(node)) {
            //scribe markers do not get pushed
            nodeList.push(node);
          }
        }
        return nodeList;
      }

      noteCommand.execute = function () {

        var selection = new scribe.api.Selection();
        var range = selection.range;
        var commonAncestor;

        // if the selection is the whole line, then we need to note the whole line
        // if it isn't then we just do the bit selected and nothing else.
        // selection.selection.data currently will duplicate things if there is no
        // actual selection
        if(selection.selection.type === "Range") {

          if (this.queryState()) {

            if (!hasBlockElements(range.cloneContents())) {
              // this is a seriously flaky way of doing it at the moment
              // I think there are much better alternatives
              // TODO: Investigate if it's even worth doing this on an undo
              // might just be able to use unwrap in the same way as it works
              // when there are block elements.


              // drop markers to play with the sibling
              selection.placeMarkers();
              selection.selectMarkers(true);

              commonAncestor = range.commonAncestorContainer;
              var parent = commonAncestor.parentNode;

              // this is random - but basically the range thinks the
              // span is the common ancestor if we only select a little bit of
              // the note
              if (commonAncestor.nextSibling) {
                parent = commonAncestor.nextSibling.parentNode;
              } else if (commonAncestor.previousSibling) {
                parent = commonAncestor.previousSibling.parentNode;
              }


              var contents = document.createTextNode(commonAncestor.innerText);
              parent.replaceChild(contents, commonAncestor);
              selection.selectMarkers();

            } else {
              // remove all styling from elements within the range
              // in this case they have selected multiple nodes
              selection.placeMarkers();
              selection.selectMarkers(true);

              // do a recursive unwrap
              commonAncestor = range.commonAncestorContainer;
              var toBeUnWrapped = buildNodeList(commonAncestor, function (node) {
                return isNote(node);
              });

              toBeUnWrapped = Array.prototype.slice.call(toBeUnWrapped);

              toBeUnWrapped.forEach(function (item) {
                unwrap(item);
              });

              selection.selectMarkers();
            }


          } else {
            // check if the selection has block elements.
            // if it does do the complex version,
            // otherwise do the simple version
            if (!hasBlockElements(range.cloneContents())) {
              var wrapped = wrapRange(range.cloneContents());
              range.deleteContents();
              range.insertNode(wrapped);
            } else {
              wrapBlocks(selection, range);
            }
          }
        }

      };

      noteCommand.queryState = function () {
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


      noteCommand.queryEnabled = function () {
        var selection = new scribe.api.Selection();
        var headingNode = selection.getContaining(function (node) {
          return (/^(H[1-6])$/).test(node.nodeName);
        });

        return scribe.api.CommandPatch.prototype.queryEnabled.apply(this, arguments) && ! headingNode;
      };


      scribe.commands.note = noteCommand;

      /* There may be case when we don't want to use the default commands */

      scribe.el.addEventListener('keydown', function (event) {
        //that's F10
        if (event.keyCode === 121) {
          var noteCommand = scribe.getCommand("note");
          var selection = new scribe.api.Selection();
          var range = selection.range;

          noteCommand.execute();
        }
      });
    };
  };
});
