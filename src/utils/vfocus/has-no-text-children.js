var isVFocus = require('./is-vfocus');
var flatten = require('./flatten-tree');
var isVText = require('./is-vtext');
var errorHandle = require('../error-handle');

module.exports = function hasNoTextChildren(focus) {

  if (!isVFocus(focus)) {
    errorHandle('Only a valid VFocus element can be passed to hasNoTextChildren, you passed: %s', focus);
  }

  return flatten(focus).filter(isVText).length === 0;
};
