// is our selection not a note?
var isVFocus = require('../vfocus/is-vfocus');
var hasClass = require('../vdom/has-class');
var errorHandle = require('../error-handle');

module.exports = function isScribeMarker(vfocus) {

  if (!isVFocus(vfocus)) {
    errorHandle('Only a valid VFocus element can be passed to isNote, you passed: %s', focus);
  }

  return hasClass(vfocus.vNode, 'scribe-marker');
};
