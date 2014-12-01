var isVFocus = require('../vfocus/is-vfocus');


var isVText = require('../vfocus/is-vtext');
var isEmpty = require('../vfocus/is-empty');
var findParentNote = require('../noting/find-parent-note');

module.exports = function isWithinNote(focus) {

  if (!isVFocus(focus)) {
    throw new Error('Only a vaid VFocus can be passed to isWithinNote');
  }

  return !isVText(focus) || isEmpty(focus) || !!findParentNote(focus);
};
