define(function () {

  /*
   * Plugin for adding a <note> elements around
   * things.
   */

  'use strict';

  return function () {
    return function(scribe) {

      //currently
      var tag = "span";
      var nodeName = "SPAN";
      var className = "note";
      var user = "Hugo Gibson"; // need to get the current user

      var noteCommand = new scribe.api.Command('insertHTML');


      //also need to define a method for splitting existing spans



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

          if(item.nodeType === 3) {
            // this is for a basic selection
            tempNode = wrapText(item, wrap);
          } else {
            tempNode = wrapBlock(item, wrap);
          }

          temp.appendChild(tempNode);
        });

        return temp;
      }

      function wrapChildren (node, end) {
        // wrap all the children in span.notes
        var childNodes = node.childNodes;

        var temp = node.cloneNode(); //do not do a deep copy

        // these are use to determine which elements to wrap
        var rangeStart = 0;
        var rangeEnd = 0;

        var withinRange = function (num) {
          // if the element is within range, i.e within
          // the scribe marker range then wrap it, otherwise
          // just append it and be done with it
          return num >= rangeStart && num <= rangeEnd;
        };


        // if end do everything before the scribe marker
        // else do everything after the marker
        if (end) {
          rangeStart = 0;
          rangeEnd = getScribeMarker(childNodes);
        } else {
          rangeStart = getScribeMarker(childNodes);
          rangeEnd = childNodes.length;
        }

        childNodes = Array.prototype.slice.call(childNodes);

        childNodes.forEach(function (item, i) {
          var tempNode = item;

          if (!item) {
            return;
          }

          if(item.nodeType === 3) {
            // either wrap a single text element
            // or wrap a block element
            if (withinRange (i)) {
              tempNode = wrapText(item);
            }
          } else {

            if (withinRange(i)) {
              tempNode = wrapBlock(item);
            }
          }

          temp.appendChild(tempNode);

        });

        return temp;
      }

      function hasBlockElements (range) {
        var blocks = ["P", "LI", "UL"];
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
        var parent = element.parentNode;
        parentNode.replaceChild(parent, element);
      }

      function unwrapSpans (tree) {
        // recur down the tree and unwrap every span
        walk(tree, function (node) {
          if (isNote(node)) {
            unwrap(node);
          }
        });
      }


      function getScribeMarker(arr) {
        for (var i = 0, len = arr.length; i < len; i++) {
          var el = arr[i];
          console.log(arr[i]);
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

      /*
       * Need to discuss this with people, etc. Should this be a command or it should

       */
      noteCommand.execute = function () {

        var selection = new scribe.api.Selection();
        var range = selection.range;


        // if the selection is the whole line, then we need to note the whole line
        // if it isn't then we just do the bit selected and nothing else.
        // selection.selection.data currently will duplicate things if there is no
        // actual selection

        if(selection.selection.type === "Range") {
          // for now we only let them do it when they have an actual selection
          if (this.queryState()) {
            //debugger;
            console.log("Removing note...");

            // remove all styling from elements withing the range
            if (!hasBlockElements(range.cloneContents())) {
              console.log(range);

              selection.placeMarkers();
              selection.selectMarkers(true);
              // use the markers to get the content between them and then
              // remove all scribe markers in this selection
              var nodeList = buildNodeList(commonAncestor);
              console.log(nodeList);
            } else {
              // do a recursive unwrap
              var unwrapped = range.commonAncestorContainer;
              var toBeUnWrapped = buildNodeList(nodeList, function (node) {
                return isNote(className);
              });

              unwrapSpans(toBeUnWrapped);

              range.deleteContents();
              range.insertNode(unwrapped);
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
              //drop markers so we can operate on all th sub elements in the node
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
          }
        }

      };

      noteCommand.queryState = function () {
        var selection = new scribe.api.Selection();
        // check if there is a note in the selection
        return !!selection.getContaining(function (node) {
          return node.nodeName === "SPAN";
        });


        //TODO: The instance in which there are more scribe nodes
        // clone the range and see if there are spans in it
        var scribeEls = selection.range.cloneContents().querySelectorAll('.note');
        return scribeEls > 0;

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
          console.log("Done...");
        }
      });
    };
  };
});
