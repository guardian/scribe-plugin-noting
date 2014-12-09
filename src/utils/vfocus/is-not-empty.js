var isVFocus = require('./is-vfocus');
var isVText = require('./is-vtext');
var isEmpty = require('./is-empty.js');

module.exports = function isNotEmpty(focus) {

  if (!isVFocus(focus)) {
    throw new Error('Only a valid VFocus can be passed to isNotEmpty');
  }

  //checking if an element is text prevents empty text elements
  //containing elements like breaks being added to the dom when
  //a note is created
  return isVText(focus) && !isEmpty(focus);
};
