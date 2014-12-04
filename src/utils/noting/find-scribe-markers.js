var isVFocus = require('../vfocus/is-vfocus');
var isScribeMarker = require('./is-scribe-marker');

module.exports = function findScribeMarkers(focus) {

  if (!isVFocus(focus)) {
    throw new Error('Only a valid VFocus element can be passed to findScribeMarkers');
  }

  return focus.filter(isScribeMarker);
};
