var isVFocus = require('../vfocus/is-vfocus');
var isNoteSegment = require('./is-note-segment');
var errorHandle = require('../error-handle');
var config = require('../../config');

module.exports = function findFirstNoteSegmentAbove(focus, tagName = config.get('defaultTagName')){

  if(!isVFocus(focus)){
    errorHandle('Only a valid VFocus can be passed to findFirstNoteSegmentAbove, you passed: %s', focus);
  }

  return focus.find((node)=>{
    return isNoteSegment(node, tagName)
  }, 'prev');

};
