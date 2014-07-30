define(function () {

    /*
     * Plugin for adding a <note> elements around
     * things. Please note this is in ALPHA
     */

    'use strict';

    return function () {
        return function(scribe) {

          //currently
          var tag = "<gu:note>";
          var nodeName = "NOTE";
          var noteCommand = new scribe.api.Command('insertHTML');


          /*
           * Need to discuss this with people, etc. Should this be a command or it should
           * the range just directly edit the formatting?
           */
          noteCommand.execute = function () {
            var selection = new scribe.api.Selection();
            var range = selection.range;
            var data;

            // if the selection is the whole line, then we need to note the whole line
            // if it isn't then we just do the bit selected and nothing else.
            // selection.selection.data currently will duplicate things if there is no
            // actual selection

            if(selection.selection.type === "Range") {
              data = selection.selection.data;

              // for now we only let them do it when they have an actual selection
              if (this.queryState()) {
                scribe.api.Command.prototype.execute.call(this, '<p>');
              } else {
                scribe.api.Command.prototype.execute.call(this, "<gu:note>" + selection.selection.anchorNode.data + "</gu:note>");
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

              console.log(range);
              noteCommand.execute();
            }
          });
        };
    };
});
