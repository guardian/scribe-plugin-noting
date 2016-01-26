var toArray = require('lodash.toarray');
var isObject = require('lodash.isobject');
var throttle = require('lodash.throttle');
var find = require('lodash.find');

var config = require('./config');
var emitter = require('./utils/emitter');
var noteCollapseState = require('./utils/collapse-state');

var findScribeMarkers = require('./utils/noting/find-scribe-markers');
var isSelectionEntirelyWithinNote = require('./utils/noting/is-selection-entirely-within-note');
var isSelectionWithinNote = require('./utils/noting/is-selection-within-note');
var removeNote = require('./actions/noting/remove-note');
var removePartOfNote = require('./actions/noting/remove-part-of-note');
var createEmptyNoteAtCaret = require('./actions/noting/create-note-at-caret');
var createNoteFromSelection = require('./actions/noting/create-note-from-selection');
var ensureNoteIntegrity = require('./actions/noting/ensure-note-integrity');
var toggleSelectedNoteCollapseState = require('./actions/noting/toggle-selected-note-collapse-state');
var toggleAllNoteCollapseState = require('./actions/noting/toggle-all-note-collapse-state');
var findParentNoteSegment = require('./utils/noting/find-parent-note-segment');
var toggleSelectedNotesTagName = require('./actions/noting/toggle-selected-note-tag-names');
var stripZeroWidthSpaces = require('./actions/noting/strip-zero-width-space');
var isCaretNextToNote = require('./utils/noting/is-caret-next-to-note');
var removeCharacterFromNote = require('./actions/noting/remove-character-from-adjacent-note');
var selectNote = require('./actions/noting/select-note');
var wrapInNoteAroundPaste = require('./actions/noting/wrap-in-note-around-paste');

var notingVDom = require('./noting-vdom');
var mutate = notingVDom.mutate;
var mutateScribe = notingVDom.mutateScribe;

//setup a listener for toggling ALL notes
// This command is a bit special in the sense that it will operate on all
// Scribe instances on the page.
emitter.on('command:toggle:all-notes', tag => {
  var state = !!noteCollapseState.get();
  var scribeInstances = document.querySelectorAll(config.get('scribeInstanceSelector'));
  scribeInstances = toArray(scribeInstances);
  scribeInstances.forEach(instance => {
    mutate(instance, focus => toggleAllNoteCollapseState(focus));
  });
  noteCollapseState.set(!state);
});

module.exports = function(scribe){
  class NoteController {
    constructor() {
      // Browser event listeners
      scribe.el.addEventListener('keydown', e => this.onNoteKeyAction(e));
      scribe.el.addEventListener('click', e => this.onElementClicked(e));
      scribe.el.addEventListener('input', e => this.validateNotes(e));
      scribe.el.addEventListener('paste', e => this.onPaste());

      //scribe command events
      emitter.on('command:note', tag => this.note(tag));
      emitter.on('command:toggle:single-note', tag => this.toggleSelectedNotesCollapseState(tag));
      //Run ensureNoteIntegrity to place missing zero-width-spaces
      this.ensureNoteIntegrity();
    }

    // noteKeyAction is triggered on key press and dynamically figures out what kind of note to create
    // selectors should be passed through the config object the default selector looks like this:
    // selectors: [ commandName: 'note', tagName: 'gu-note, {'keyCodes': [ 119 , 121 , {'altKey', 8} ]} ];
    // if you need a special key (the default uses alt) specify an object within the keyCodes array
    // where the key is the modifier (expected on the event object)
    // and the val is the key code
    onNoteKeyAction(e) {

      //if we press backspace
      if (e.keyCode === 8) {
        mutateScribe(scribe, (focus)=>{
          config.get('selectors').forEach((selector)=>{
            //and there is an adjacent note
            if (isCaretNextToNote(focus, 'prev', selector.tagName)
                && !isSelectionWithinNote(focus, selector.tagName)) {
                  e.preventDefault();
                  removeCharacterFromNote(focus, 'prev', selector.tagName);
                }
          });
        });
      }

      //when we press delete
      if (e.keyCode === 46) {
        mutateScribe(scribe, (focus)=>{
          config.get('selectors').forEach((selector)=>{
            //and there is an adjacent note
            if (isCaretNextToNote(focus, 'next', selector.tagName)
                && !isSelectionWithinNote(focus, selector.tagName)) {
                  e.preventDefault();
                  removeCharacterFromNote(focus, 'next', selector.tagName);
                }
          });
        });
      }

      // selecting notes (CTRL/META + SHIFT + A)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.keyCode === 65) {
        // e.g. Firefox uses this keyboard combination to open the Add-ons Manager.
        e.preventDefault();

        this.selectNote();
      }

      var selectors = config.get('selectors');
      selectors.forEach(selector => {
        //we need to store the tagName to be passed to this.note()
        var tagName = selector.tagName;

        selector.keyCodes.forEach(keyCode => {
          //if we get just a number we check the keyCode
          if (!isObject(keyCode) && e.keyCode === keyCode){
            e.preventDefault();
            this.note(tagName);
          } else if(isObject(keyCode)){
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

    //onElementClicked when scribe is clicked we need to figure out what kind of interaction to perform
    onElementClicked(e) {

      //selecting whole notes
      if (e.metaKey || e.ctrlKey) {
        this.selectNote();
      }

      switch(e.target.getAttribute('data-click-action')){
        case 'toggle-tag':
          e.preventDefault();
        this.toggleClickedNotesTagNames(e.target);
        break;

        default:
          e.preventDefault();
        this.toggleClickedNotesCollapseState(e.target);
        break;
      }
    }

    onPaste() {
      if (this.isPasteInsideNote()) {
        mutateScribe(scribe, (focus) => wrapInNoteAroundPaste(focus))
      }
    }

    // We assume user pasted inside a note if the number of notes changed.
    isPasteInsideNote() {
      var pos = scribe.undoManager.position
      var item = scribe.undoManager.item(pos)[0]

      var notesBeforePaste = countNotes(item.previousItem.content)
      var notesAfterPaste = countNotes(item.content)

      return notesAfterPaste != notesBeforePaste

      // The number of notes in an HTML is the sum of number of note tags and start/end classes.
      function countNotes(html) {
        var hints = [
          config.get('defaultTagName'),
          config.get('noteStartClassName'),
          config.get('noteEndClassName')
        ]

        // split is the fastest way
        // http://jsperf.com/find-number-of-occurrences-using-split-and-match
        return hints.reduce((p, c) => {
          return p + html.split(c).length
        }, 0)

      }
    }

    // ------------------------------
    // TOGGLE TAG NAMES
    // ------------------------------

    //toggleSelectedNotesTagNames toggles the tag names of any notes within a given selection
    toggleClickedNotesTagNames(target){
      config.get('selectors').forEach( selector => {
        //if we have a valid note element
        if(target.nodeName === selector.tagName.toUpperCase()){
          this.selectClickedElement(target);
          this.toggleSelectedNotesTagNames(selector.tagName, selector.toggleTagTo);
          this.clearSelection();
        }
      });
    }

    //toggleAllNotesTagNames will toggle the tag names of clicked notes
    toggleSelectedNotesTagNames(tagName, replacementTagName) {
      mutateScribe(scribe, (focus)=> toggleSelectedNotesTagName(focus, tagName, replacementTagName));
    }

    // ------------------------------
    // COLLAPSE / EXPAND NOTES
    // ------------------------------

    //toggleClickedNotesCollapseState when note is clicked we need to figure out if the target is a note
    //and set the selection so we can act on it
    toggleClickedNotesCollapseState(target){
      config.get('selectors').forEach( selector => {
        //if we have a valid note element
        if(target.nodeName === selector.tagName.toUpperCase()){
          this.selectClickedElement(target);
          this.toggleSelectedNotesCollapseState(selector.tagName);
        }
      });
    }

    //toggleSelectedNotesCollapseState will collapse or expand all (or a selected) note
    toggleSelectedNotesCollapseState(tagName) {
      mutateScribe(scribe, (focus)=> toggleSelectedNoteCollapseState(focus, tagName));
      this.clearSelection();
    }

    // This command is a bit special in the sense that it will operate on all
    // Scribe instances on the page.
    toggleAllNotesCollapseState() {
      var state = !!noteCollapseState.get();
      var scribeInstances = document.querySelectorAll(config.get('scribeInstanceSelector'));
      scribeInstances = toArray(scribeInstances);
      scribeInstances.forEach(instance => {
        mutate(instance, focus => toggleAllNoteCollapseState(focus));
      });
    }


    //selectClickedElement will create a selection around a clicked element
    selectClickedElement(target) {
      var vSelection = new scribe.api.Selection();
      var range = document.createRange();
      range.selectNodeContents(target);
      vSelection.selection.removeAllRanges();
      vSelection.selection.addRange(range);
    }

    clearSelection(){
      var selection = new scribe.api.Selection();
      selection.selection.removeAllRanges();
    }


    // ------------------------------
    // SELECTING A WHOLE NOTE
    // ------------------------------

    selectNote() {
      mutateScribe(scribe, (focus, selection) => {
        var markers = findScribeMarkers(focus);

        //ensure we have a selection, return otherwise
        if (markers.length === 0) {
          return;
        }

        //check that the selection is within a note
        var selector = find(config.get('selectors'), (selector => {
          // isSelectionWithinNote rather than isSelectionEntirelyWithinNote
          // since we want to allow all clicks within a note, even if it
          // selects the note and some text to the left or right of the note.
          return isSelectionWithinNote(markers, selector.tagName);
        }));

        //if the selection is within a note select that note
        if (selector) {
          window.getSelection().removeAllRanges();
          // we rely on the fact that markers[0] is within a note.
          var noteSegment = findParentNoteSegment(markers[0], selector.tagName);
          selectNote(noteSegment, selector.tagName);
        }
      });
    }

    // ------------------------------
    // NOTING
    // ------------------------------

    //Note function does all the heavy lifting when:
    //- creating
    //- deleting
    //- merging
    note(tagName = config.get('defaultTagName')) {
      //get scribe.el content (virtualized) and the current selection
      mutateScribe(scribe, (focus, selection) => {
        //figure out what kind of selection we have
        var markers = findScribeMarkers(focus);
        if(markers.length <= 0){
          return;
        }
        var selectionIsCollapsed = (markers.length === 1);

        /* Removed due to legitimate concern
         * you should be able to note a paragraph containing notes
         * should be removed if decided the above statement is correct jp 16/2/15
        //we need to figure out if our caret or selection is within a conflicting note
        var isWithinConflictingNote = false;
        config.get('selectors').forEach((selector)=>{
        if((selector.tagName !== tagName) && isSelectionWithinNote(markers, selector.tagName)){
        isWithinConflictingNote = true;
        }
        });

        //if we ARE within a confilicting note type bail out.
        if(isWithinConflictingNote){
        return;
        }
        */

        var isWithinNote = isSelectionEntirelyWithinNote(markers, tagName);
        var isPartiallyWithinNote = isSelectionWithinNote(markers, tagName)

        //If the caret is within a note and nothing is selected
        if (selectionIsCollapsed && isWithinNote){
          removeNote(focus, tagName);
        }
        //if we have a selection within a note
        else if (isWithinNote){
          removePartOfNote(focus, tagName);
        }
        //if we have no selection outside of a note
        else if (selectionIsCollapsed){
          createEmptyNoteAtCaret(focus, tagName);
        }
        //if we have a selection outside of a note
        else {
          createNoteFromSelection(focus, tagName, isPartiallyWithinNote);
        }

      });
    }

    //validateNotes makes sure all note--start note--end and data attributes are in place
    validateNotes() {
      throttle(()=> {
        this.ensureNoteIntegrity();
      }, 1000)();
    }

    ensureNoteIntegrity(){
      mutateScribe(scribe, (focus)=> {
        //strip the document of ALL zero width spaces
        stripZeroWidthSpaces(focus);
      });

      mutateScribe(scribe, (focus)=> {
        config.get('selectors').forEach((selector)=>{
          //run through EACH kind of note and re-add the zero width spaces
          ensureNoteIntegrity(focus, selector.tagName);
        });
      });

    }

  }

  return new NoteController();

};
