var isVFocus = require('../vfocus/is-vfocus');
var findBetweenScribeMarkers = require('./find-between-scribe-markers');
var findTextNodes = require('../vfocus/find-text-nodes');
var errorHandle = require('../error-handle');

module.exports = function findTextBetweenScribeMarkers(focus) {

  if (!isVFocus(focus)) {
    errorHandle('Only a valid VFocus can be passed to findTextBetweenScribeMarkers, you passed: %s', focus);
  }

  return findTextNodes(findBetweenScribeMarkers(focus));

};
