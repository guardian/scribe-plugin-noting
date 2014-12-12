var _ = require('lodash');
var isVFocus = require('../../utils/vfocus/is-vfocus');
var findTextbetweenScribeMarkers = require('../../utils/noting/find-text-between-scribe-markers');
var isNotWithinNote = require('../../utils/noting/is-not-within-note');
var getNoteDateAttrs = require('../../utils/get-note-data-attrs');
var wrapInNote = require('./wrap-in-note');

module.exports = function createNoteFromSelection(focus){

  if(!isVFocus(focus)){
    throw new Error('Only a valid VFocus element can be passed to createNoteFromSelection');
  }

  // We want to wrap text nodes between the markers. We filter out nodes that have
  // already been wrapped.
  var contents = findTextbetweenScribeMarkers(focus).filter(isNotWithinNote);
  var timeStamp = getNoteDataAttrs();

  //generate wrapped text nodes
  var notes = contents.map(function(node){
     return wrapInNote(node, timeStamp);
  });


  // Replace the nodes in the tree with the wrapped versions.
  _.zip(contents, notes).forEach(function(group){
    var focus = group[0];
    var note = group[1];
    focus.replace(note);
  });

  // If we end up with an empty note a <BR> tag would be created. We have to do
  // this before we remove the markers.


};
