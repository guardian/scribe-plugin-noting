var isVFocus = require('../vfocus/is-vfocus');
var isNoteSegment = require('./is-note-segment');
var errorHandle = require('../error-handle');
var config = require('../../config');

module.exports = function findFirstNoteSegmentBelow(focus, tagName = config.get('defaultTagName')){

  if(!isVFocus(focus)){
    errorHandle('Only a valid VFocus can be passed to findFirstNoteSegmentBelow, you passed: %s', focus);
  }

  return focus.find((node)=> isNoteSegment(node, tagName));

};
