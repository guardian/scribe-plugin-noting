var _ = require('lodash');
var addClass = require('../../actions/vdom/add-class');
var removeClass = require('../../actions/vdom/remove-class');
var isVFocus = require('../../utils/vfocus/is-vfocus');
var generateUUID = require('../../utils/generate-uuid');
var addAttribute = require('../vdom/add-attribute');
var getUKDate = require('../../utils/get-uk-date');
var config = require('../../config');

// Ensure the first (and only the first) note segment has a
// `note--start` class and that the last (and only the last)
// note segment has a `note--end` class.
module.exports = function updateStartAndEndClasses(noteSegments, tagName = config.get('defaultTagName')) {

  if (!noteSegments) {
    return;
  }

  noteSegments = _.isArray(noteSegments) ? noteSegments : [noteSegments];

  var uuid = generateUUID();

  //get the click interaction type
  var clickInteractionType = config.get('selectors').reduce((last, selector) => {
    return (selector.tagName === tagName) ? selector.clickAction : last;
  }, config.get('defaultClickInteractionType'));

  noteSegments.forEach(function(note, index) {
    var node = (note.vNode || note);
    //set the interaction type on a given node
    addAttribute(node, 'data-click-action', clickInteractionType);
    addAttribute(node, 'data-note-id', uuid);
    removeClass(node, 'note--start');
    removeClass(node, 'note--end');
  });

  addClass(noteSegments[0].vNode, 'note--start');
  addClass(noteSegments[noteSegments.length - 1].vNode, 'note--end');

  return noteSegments;
};

