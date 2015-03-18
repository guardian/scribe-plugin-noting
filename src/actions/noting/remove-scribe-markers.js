var isVFocus = require('../../utils/vfocus/is-vfocus');
var isScribeMarker = require('../../utils/noting/is-scribe-marker');
var errorHandle = require('../../utils/error-handle');

/**
 * Iterates through the entire tree from the top and removes all the scribe markers.
 * @param  {VFocus} focus Any focus within the tree.
 */
module.exports = function removeScribeMarkers(focus) {

  if (!isVFocus(focus)) {
    errorHandle('Only a valid VFocus can be passed to removeScribeMarkers, you passed: %s', focus);
  }

  focus.top().filter(isScribeMarker).forEach(function(marker) {
    marker.remove();
  });

};
