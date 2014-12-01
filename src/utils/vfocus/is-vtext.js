var isVText = require('vtree/is-vtext');

var VFocus = require('../../vfocus');
var isVFocus = require('../vfocus/is-vfocus');

//thin utility wrapper for vFocus elements rather than VNodes
module.exports = function isVTextVFocus(vfocus) {
  if (!isVFocus(vfocus)) {
    throw new Error('only a VFocus element should be passed to isVText');
  }

  return isVText(vfocus.vNode);
};
