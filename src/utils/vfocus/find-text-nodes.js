var _ = require('lodash');
var isVFocus = require('../vfocus/is-vfocus');
var isVText = require('../vfocus/is-vtext');

module.exports = function findTextNodes(focuses) {

  focuses = _.isArray(focuses) ? focuses : [focuses];

  focuses.forEach(function(focus) {
    if (!isVFocus(focus)) {
      throw new Error('Only valid VFocus elements should be passes to findTextNodes');
    }
  });

  return focuses.filter(isVText);
};
