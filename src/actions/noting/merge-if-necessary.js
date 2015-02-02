var _ = require('lodash');
var isVFocus = require('../../utils/vfocus/is-vfocus');
var errorHandle = require('../../utils/error-handle');
var findAllNotes = require('../../utils/noting/find-all-notes');
var resetNoteSegmentClasses = require('./reset-note-segment-classes');
var config = require('../../config');

/*
   Example. We have two notes:
   <p>
   <gu-note>Some noted text</gu-note>| and some other text inbetween |<gu-note>More noted text</gu-note>
   </p>

   We press BACKSPACE, deleting the text, and end up with:
   <p>
   <gu-note data-note-edited-by="Edmond Dantès" data-note-edited-date="2014-09-15T16:49:20.012Z">Some noted text</gu-note><gu-note data-note-edited-by="Lord Wilmore" data-note-edited-date="2014-09-20T10:00:00.012Z">More noted text</gu-note>
   </p>

   This function will merge the notes:
   <p>
   <gu-note data-note-edited-by="The Count of Monte Cristo" data-note-edited-date="2014-10-10T17:00:00.012Z">Some noted text</gu-note><gu-note data-note-edited-by="The Count of Monte Cristo" data-note-edited-date="2014-10-10T17:00:00.012Z">More noted text</gu-note>
   </p>

   The last user to edit "wins", the rationale being that they have approved
   these notes by merging them. In this case all note segments are now
   listed as being edited by The Count of Monte Cristo and the timestamp
   shows the time when the notes were merged.
   */
module.exports = function mergeIfNecessary(focus, tagName = config.get('defaultTagName')){

  if (!isVFocus(focus)){
    errorHandle('Only a valid VFocus can be passed to mergeIfNecessary, you pased: %s', focus);
  }

  // Merging is simply a matter of updating the attributes of any notes
  // where all the segments of the note doesn't have the same timestamp,
  // or where there's no start or end property (e.g. when the user has deleted
  // the last note segment of a note).

  findAllNotes(focus, tagName)
  //find any notes that need to be reset
  .filter(note => {

    //find any inconsistent time stamps
    var inconsistentTimeStamps = _(note)
    .map(segment => !!segment.vNode.properties.dataset.noteEditedBy)
    .uniq()
    .value();

    if(inconsistentTimeStamps.length > 1){
      return true;
    }

    //check for the right data attributes
    var hasNoteStart = 'noteStart' in note[0].vNode.properties.dataset;
    var hasNoteEnd = 'noteEnd' in note[note.length - 1].vNode.properties.dataset;
    return !(hasNoteStart && hasNoteEnd);

  })
  //reset any resulting notes properties
  .forEach(note =>{
    resetNoteSegmentClasses(note);
  });
}
