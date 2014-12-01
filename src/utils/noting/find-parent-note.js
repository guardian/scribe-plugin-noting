var isNote = require('../noting/is-note');
var isVFocus = require('../vfocus/is-vfocus');

module.exports = function findParentNote(focus) {

  if (!isVFocus(focus)) {
    throw new Error('only a VFocus element should be passed to findParentNote');
  }

  return focus.find(isNote, 'up');
};
