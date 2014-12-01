var isVFocus = require('./is-vfocus');
var isEmpty = require('../vdom/is-empty');

module.exports = function isEmptyVFocus(vfocus){
  if(!isVFocus(vfocus)){
    throw new Error('only a VFocus element should be passed to isEmptyVFocus');
  }

  return isEmpty(vfocus.vNode);
};
