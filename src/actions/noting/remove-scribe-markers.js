var isVFocus = require('../../utils/vfocus/is-vfocus');
var isScribeMarker = require('../../utils/noting/is-scribe-marker');
var errorHandle = require('../../utils/error-handle');

module.exports = function removeScribemarkers(focus) {

  if (!isVFocus(focus)) {
    errorHandle('Only a valid VFocus can be passed to removeScribeMarkers, you passed: %s', focus);
  }

  focus.filter(isScribeMarker).forEach(function(marker) {
    marker.remove();
  });

};
