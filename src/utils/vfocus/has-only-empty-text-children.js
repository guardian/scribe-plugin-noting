var isVFocus = require('./is-vfocus');
var flatten = require('./flatten-tree');
var isVText = require('./is-vtext');
var isEmpty = require('./is-empty');
var errorHandle = require('../error-handle');

module.exports = function hasNoTextChildren(focus) {

  if (!isVFocus(focus)) {
    errorHandle('Only a valid VFocus can be passed to hasNoTextChildren, you passed: %s', focus);
  }

  return flatten(focus).filter(isVText).every(isEmpty);
};
