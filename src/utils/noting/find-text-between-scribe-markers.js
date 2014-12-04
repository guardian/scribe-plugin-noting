var isVFocus = require('../vfocus/is-vfocus');
var findBetweenScribeMarkers = require('./find-between-scribe-markers');
var findTextNodes = require('../vfocus/find-text-nodes');


module.exports = function findTextBetweenScribeMarkers(focus) {

  if (!isVFocus(focus)) {
    throw new Error('Only a valid VFocus element can be passed to findTextBetweenScribeMarkers');
  }

  return findTextNodes(findBetweenScribeMarkers(focus));

};
