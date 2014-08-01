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
      var noteCommand = new scribe.api.Command('insertHTML');



      //also need to define a method for splitting existing spans



      function createWrap() {
        var wrap = document.createElement(tag);
        wrap.className = className;
        return wrap;

      }


      function wrapText(content, wrap) {
        //wrap the contents of a text node
        // they behave diffent
        var wrap = createWrap();
        wrap.innerHTML = content.data;
        return wrap;
      }

      function wrapBlock(block, wrap) {
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

      function treeWalkerWrap (commonAncestor) {
        var treeWalker = document.createTreeWalker(commonAncestor, NodeFilter.SHOW_ELEMENT);
        var node = treeWalker.firstChild();
        var newTree = commonAncestor.cloneNode();
        if (!node) return;
        var done = false;
        var markerCount = 0;

        do {
          // when the count is 0 return
          if (done === true) {
            console.log("All done.");
            break;
          }

          var scribeMarker = findScribeMarker(node);

          if (scribeMarker === -1) {
            console.log("No marker");
            done = false;
            break;
          } else {
            if (markerCount === 1 ) {
              // in this case there is already a marker
              // so we've reached the second one and it's over
              newTree.appendChild(wrapChildren(node, true));
              done = true;
            } else {
              markerCount = 1; //can only be 0 or 1
            }
          }

          if(!done) {
            //get every child node in between and wrap it
            newTree.appendChild(wrapChildren(node, false));
          }

        } while ((node = treeWalker.nextSibling()));

        return newTree;
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
            console.log("Removing note...");
            // remove all styling from elements withing the range
            scribe.api.Command.prototype.execute.call(this, '<p>');
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

              var commonAncestor = range.commonAncestorContainer.cloneNode(true);
              selection.selectMarkers();

              // do the treewalker solution
                /*
                 * Basic algorithm
                 * Walk the DOM
                 * Find first scribe marker
                 * Wrap every element
                 * Find last scribe marker
                 * Return
                 */

              debugger;
              var newTree = treeWalkerWrap(commonAncestor);

              // replace the common ancestor with the newTree
              console.log(newTree);
              commonAncestor.innerHTML = newTree.innerHTML;
              console.log(commonAncestor);
            }
          }
        }

      };

      noteCommand.queryState = function () {
        var selection = new scribe.api.Selection();
        return !! selection.getContaining(function (node) {
          return node.nodeName === nodeName;
        });
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
          console.log(scribe.el.innerHTML);
        }
      });
    };
  };
});
