var isVFocus = require('./is-vfocus');
var errorHandle = require('../error-handle');

module.exports = function flattenTree(focus) {

  if (!isVFocus(focus)) {
    errorHandle('Only a valid VFocus element can be passed to flattenTree, you passed: %s', focus);
  }

  return focus.takeWhile(function(insideOfFocus) {
    return !!insideOfFocus.find(function (f) { return f.vNode === focus.vNode; }, 'up');
  });

};
