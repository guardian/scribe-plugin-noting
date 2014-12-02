var isVFocus = require('./is-vfocus');

module.exports = function flattenTree(focus) {
  if (!isVFocus(focus)) {
    throw new Error('only a valid VFocus can be passed to flattenTree');
  }

  return focus.takeWhile(function(insideOfFocus) {
    return !!insideOfFocus.find(function (f) { return f.vNode === focus.vNode; }, 'up');
  });

};
