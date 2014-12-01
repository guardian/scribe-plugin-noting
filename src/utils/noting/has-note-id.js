var hasAttribute = require('../vdom/has-attribute');
var isVFocus = require('../vfocus/is-vfocus');

module.exports = function hasNoteId(vNode, value){
   return hasAttribute(vNode, 'data-note-id', value);
};
