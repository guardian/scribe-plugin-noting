var isVFocus = require('../vfocus/is-vfocus');
var isScribeMarker = require('./is-scribe-marker');
var errorHandle = require('../error-handle');

module.exports = function findScribeMarkers(focus) {

  if (!isVFocus(focus)) {
    errorHandle('Only a valid VFocus can be passed to findScribeMarkers, you passed: %s', focus);
  }

  return focus.filter(isScribeMarker);
};
