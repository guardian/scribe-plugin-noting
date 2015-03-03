var isVFocus = require('../../utils/vfocus/is-vfocus');
var errorhandle = require('../../utils/error-handle');
var isVText = require('../../utils/vfocus/is-vtext');

module.exports = function stripZeroWidthSpaces(focus){

  if (!isVFocus(focus)) {
    errorhandle('Only a valid VFocus can be passed to stripZeroWidthSpaces, you passed: %s', focus);
  }

  focus.filter(isVText).forEach((node)=>{
    node.vNode.text = node.vNode.text.replace(/\u200B/g, '');
  });

  return focus;
};
