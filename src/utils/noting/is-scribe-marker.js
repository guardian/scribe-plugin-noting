// is our selection not a note?
var isVFocus = require('../vfocus/is-vfocus');
var hasClass = require('../vdom/has-class');

module.exports = function isScribeMarker(vfocus) {

  if(!isVFocus(vfocus)) {
    throw new Error('Only a VFocus element should be passed to isNote()');
  }

  return hasClass(vfocus.vNode, 'scribe-marker');
};


