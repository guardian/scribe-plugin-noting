// We incude regular spaces because if we have a note tag that only
// includes a a regular space, then the browser will also insert a <BR>.
// If we consider a string containing only a regular space as empty we
// can remove the note tag to avoid the line break.
//
// Not ideal since it causes the space to be deleted even though the user
// hasn't asked for that. We compensate for this by moving any deleted
// space to the previous note segment.

var isVText = require('vtree/is-vtext');

module.exports = function(node) {
  if (isVText(node)) {
   var text = node.text;
   return text === '' ||
     text === '\u200B' ||
     text === '\u00a0' ||
     text === ' ';
  } else {
    return node.children.length <= 0;
  }
 };
