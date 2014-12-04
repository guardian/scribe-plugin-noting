var isVFocus = require('../vfocus/is-vfocus');
var isScribeMarker = require('./is-scribe-marker');

module.exports = function removeScribemarkers(focus) {

  if (!isVFocus(focus)) {
    throw new Error('Only a valid VFocus can be passed to removeScribemarkers');
  }

  focus.filter(isScribeMarker).forEach(function(marker) {
    marker.remove();
  });

};
