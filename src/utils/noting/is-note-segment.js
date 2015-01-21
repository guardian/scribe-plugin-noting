var _ = require('lodash');
var isVFocus = require('../vfocus/is-vfocus');
var isTag = require('../vdom/is-tag');
var errorHandle = require('../error-handle');
var config = require('../../config');

// function isNote
// identifies whether a given vfocus is a note
module.exports = function isNote(vfocus, tagName = config.get('defaultTagName')) {

  if (!isVFocus(vfocus)) {
    errorHandle('Only a valid VFocus element can be passed to isNote, you passed: %s', focus);
  }


  //if this function is placed within a iterator (takeWhile for example)
  //the index will be passed as second argument
  //as such we need to correct this or we won't get a correct result
  if(!_.isString(tagName)){
    tagName = config.get('defaultTagName');
  }

  return isTag(vfocus.vNode, tagName);
};
