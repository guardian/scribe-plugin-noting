var isVFocus = require('../../utils/vfocus/is-vfocus');
var findScribeMarkers = require('../../utils/noting/find-scribe-markers');
var findEntireNote = require('../../utils/noting/find-entire-note');
var flattenTree = require('../../utils/vfocus/flatten-tree');
var isEmpty = require('../../utils/vfocus/is-empty');

var isNote = require('../../utils/noting/is-note');

module.exports = function removeEmptyNodes(focus) {

  if (!isVFocus(focus)) {
    throw new Error('Only a valid VFocus can be passed to removeEmptyNodes');
  }

  //we assume that a user (in this case) is pressing delete.
  //if there is a actual se;ection we want to do nothing
  var markers = findScribeMarkers(focus);
  if (markers.length !== 1) {
    return focus;
  }

  //var note = findEntireNote(markers[0]);

  var marker = markers[0];
  var note = [
    marker.find(function(node){

    console.log('find', isNote(node));
    console.log('-----------------------');
    console.log(node);
    console.log('-----------------------');

    return isNote(node);

  }, 'prev'),
    marker.find(isNote)
  ].filter(function(obj){
    return !!obj;
  });

  console.log('-----------------------');
  console.log(note);
  console.log('-----------------------');

  var sequence = flattenTree(note);

  sequence.forEach(function(node) {

    if (isEmpty(node)) {
      node.remove();
    }
  });

};
