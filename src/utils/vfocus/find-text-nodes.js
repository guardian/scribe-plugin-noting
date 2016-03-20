var isVFocus = require('../vfocus/is-vfocus');
var isVText = require('../vfocus/is-vtext');
var errorHandle = require('../error-handle');

module.exports = function findTextNodes(focuses) {

  focuses = Array.isArray(focuses) ? focuses : [focuses];

  focuses.forEach(function(focus) {
    if (!isVFocus(focus)) {
      errorHandle('Only a valid VFocus can be passed to findTextNodes, you passed: %s', focus);
    }
  });

  return focuses.filter(isVText);
};
