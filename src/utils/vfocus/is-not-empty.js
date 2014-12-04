var isVFocus = require('./is-vfocus');
var isEmpty = require('./is-empty.js');

module.exports = function isNotEmpty(focus){

  if(!isVFocus(focus)){
    throw new Error('Only a valid VFocus can be passed to isNotEmpty');
  }

  return ! isEmpty(focus);
};
