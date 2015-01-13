var _ = require('lodash');

var config = require('./config');
var emitter = require('./utils/emitter');
var noteCollapseState = require('./utils/collapse-state');

var NoteCommandFactory = require('./NoteCommandFactory');

var findScribeMarkers = require('./utils/noting/find-scribe-markers');
var isSelectionWithinNote = require('./utils/noting/is-selection-within-note');
var removeNote = require('./actions/noting/remove-note');
var removePartOfNote = require('./actions/noting/remove-part-of-note');
var createEmptyNoteAtCaret = require('./actions/noting/create-note-at-caret');
var createNoteFromSelection = require('./actions/noting/create-note-from-selection');
var ensureNoteIntegrity = require('./actions/noting/ensure-note-integrity');
var toggleSelectedNoteCollapseState = require('./actions/noting/toggle-selected-note-collapse-state');
var toggleAllNoteCollapseState = require('./actions/noting/toggle-all-note-collapse-state');

var notingVDom = require('./noting-vdom');
var mutate = notingVDom.mutate;
var mutateScribe = notingVDom.mutateScribe;

module.exports = function(scribe, attrs){

  class NoteController {
    constructor() {

      //setup the config
      config.set(attrs);

      config.get('selectors').forEach(selector => {
        NoteCommandFactory(scribe, selector.commandName, selector.tagName);
      });

      //browser events
      scribe.el.addEventListener('keydown', e => this.onNoteKeyAction(e));
      scribe.el.addEventListener('click', e => this.onElementClicked(e));
      scribe.el.addEventListener('input', e => this.validateNotes(e));

      //scribe command events
      emitter.on('command:note', tag => this.note(tag));
      emitter.on('command:toggle:single-note', tag => this.toggleSelectedNotes(tag));
      emitter.on('command:toggle:all-notes', tag => this.toggleAllNotes(tag));
    }


    // noteKeyAction is triggered on key press and dynamically figures out what kind of note to create
    // selectors should be passed through the config object the default selector looks like this:
    // selectors: [ commandName: 'note', tagName: 'gu-note, {'keyCodes': [ 119 , 121 , {'altKey', 8} ]} ];
    // if you need a special key (the default uses alt) specify an object within the keyCodes array
    // where the key is the modifier (expected on the event object)
    // and the val is the key code
    onNoteKeyAction(e) {
      var selectors = config.get('selectors');
      selectors.forEach(selector => {
        //we need to store the tagName to be passed to this.note()
        var tagName = selector.tagName;

        selector.keyCodes.forEach(keyCode => {
          //if we get just a number we check the keyCode
          if (!_.isObject(keyCode) && e.keyCode === keyCode){
            e.preventDefault()
            this.note(tagName);
          } else {
            //in the dynamic case we need to check for BOTH the modifier key AND keycode
            var modifier = Object.keys(keyCode)[0];
            if(e[modifier] && e.keyCode === keyCode[modifier]){
              e.preventDefault();
              this.note(tagName);
            }
          }
        });
      });
    }

    //onElementClicked when scribe is clicked we need to figure out if the target is a note
    //and set the selection so we can act on it
    onElementClicked(e) {
      var selectors = config.get('selectors');
      selectors.forEach( selector => {
        //if we have a valid note element
        if(e.target.nodeName === selector.tagName.toUpperCase()){
          e.preventDefault();
          var vSelection = new scribe.api.Selection();
          var range = document.createRange();
          range.selectNodeContents(e.target);
          vSelection.selection.removeAllRanges();
          vSelection.selection.addRange(range);
          this.toggleSelectedNotes();
        }
      });
    }

    //Note function does all the heavy lifting when:
    //- creating
    //- deleting
    //- merging
    note(selector = config.get('defaultTagName')) {
      //get scribe.el content (virtualized) and the current selection
      mutateScribe(scribe, (focus, selection) => {
        //figure out what kind of selection we have
        var markers = findScribeMarkers(focus);
        var selectionIsCollapsed = (markers.length === 1);
        var isWithinNote = isSelectionWithinNote(markers);

        //If the caret is within a note and nothing is selected
        if (selectionIsCollapsed && isWithinNote){
          removeNote(focus);
        }
        //if we have a selection within a note
        else if (isWithinNote){
          removePartOfNote(focus);
        }
        //if we have no selection outside of a note
        else if (selectionIsCollapsed){
          createEmptyNoteAtCaret(focus);
        }
        //if we have a selection outside of a note
        else {
          createNoteFromSelection(focus);
        }

      });
    }

    //toggleAllNotes will collapse or expand all (or a selected) note
    toggleSelectedNotes() {
      mutateScribe(scribe, (focus)=> toggleSelectedNoteCollapseState(focus));
    }

    // This command is a bit special in the sense that it will operate on all
    // Scribe instances on the page.
    toggleAllNotes() {
      var state = !!noteCollapseState.get();
      var scribeInstances = document.querySelectorAll(config.get('scribeInstanceSelector'));
      scribeInstances = Array.prototype.slice.call(scribeInstances);
      scribeInstances.forEach(instance => {
        mutate(instance, focus => toggleAllNoteCollapseState(focus));
      });
    }

    //validateNotes makes sure all note--start note--end and data attributes are in place
    validateNotes() {
      _.throttle(()=> {
        mutateScribe(scribe, (focus)=> ensureNoteIntegrity(focus));
      }, 1000)();
    }

  };

  return new NoteController();

};
