var isScribeMarker = require('./is-scribe-marker');

module.exports = function isNotScribeMarker(focus){
  return !isScribeMarker(focus);
};
