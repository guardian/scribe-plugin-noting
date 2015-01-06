var _ = require('lodash');
var addClass = require('../../actions/vdom/add-class');
var removeClass = require('../../actions/vdom/remove-class');
var isVFocus = require('../../utils/vfocus/is-vfocus');

// Ensure the first (and only the first) note segment has a
// `note--start` class and that the last (and only the last)
// note segment has a `note--end` class.
module.exports = function updateStartAndEndClasses(noteSegments) {

  if (!noteSegments) {
    return;
  }

  noteSegments = _.isArray(noteSegments) ? noteSegments : [noteSegments];

  noteSegments.forEach(function(note, index) {
    note = (note.vNode || note);
    removeClass(note, 'note--start');
    removeClass(note, 'note--end');
  });

  addClass(noteSegments[0].vNode, 'note--start');
  addClass(noteSegments[noteSegments.length -1].vNode, 'note--end');

  return noteSegments;
};
