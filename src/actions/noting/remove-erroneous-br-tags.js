var VText = require('vtree/vtext');
var isVFocus = require('../../utils/vfocus/is-vfocus');
var isVText = require('../../utils/vfocus/is-vtext');
var errorHandle = require('../../utils/error-handle');
var findScribeMarkers = require('../../utils/noting/find-scribe-markers');
var isNoteSegment = require('../../utils/noting/is-note-segment');
var hasOnlyEmptyTexChildren = require('../../utils/vfocus/has-only-empty-text-children');
var hasNoTextChildren = require('../../utils/vfocus/has-no-text-children');

// In a contenteditable, Scribe currently insert a <BR> tag into empty elements.
// This causes styling issues when the user deletes a part of a note,
// e.g. using backspace. This function provides a workaround and should be run
// anytime a note segment might be empty (as defined by `vdom.consideredEmpty`).
// TODO: Fix this in Scribe.
module.exports = function preventBrTags(focus) {
  if (!isVFocus(focus)) {
    errorHandle('Only a valid VFocus element can be passed to preventBrTags, you passsed: %s', focus);
  }

  // We're only interested in when content is removed, meaning
  // there should only be one marker (a collapsed selection).
  //
  // Could possibly develop a way of knowing deletions from
  // additions, but this isn't necessary at the moment.
  var markers = findScribeMarkers(focus);

  //if we have a selection return
  if (markers.length === 2 || !markers[0]){
    return;
  }

  var marker = markers[0];

  //find the previous and next note segment
  var segments = [
    marker.find(isNoteSegment, 'prev'),
    marker.find(isNoteSegment)
  ].filter(o => !!o);

  // Replace/delete empty notes, and parents that might have become empty.
  segments.map(segment => {
    if (hasOnlyEmptyTexChildren(segment)){
      // When we delete a space we want to add a space to the previous
      // note segment.
      var prevNoteSegment  = segment.prev().find(isNoteSegment, 'prev');
      if (prevNoteSegment){
        //get the last text node
        var lastTextNode = prevNoteSegment.vNode.children.filter(isVText).slice(-1)[0];
        if (lastTextNode){
          lastTextNode.text = lastTextNode.text + ' ';
        }
      }
    }

    if (hasNoTextChildren(segment) || hasOnlyEmptyTexChildren(segment)){
      // In Chrome, removing causes text before the note to be deleted when
      // deleting the last note segment. Replacing with an empty node works
      // fine in Chrome and FF.
      var replaced = segment.replace(new VText('\u200B'));

      //remove empty ancestor nodes
      while (replaced){
        if (!replaced.canDown()){
          replaced.remove();
        }
        replaced = replaced.up();
      }
    }
  });

};
