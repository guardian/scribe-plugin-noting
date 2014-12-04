var isVFocus = require('./is-vfocus');
var flatten = require('./flatten-tree');
var isVText = require('./is-vtext');
var isEmpty = require('./is-empty');

module.exports = function hasNoTextChildren(focus){

  if(!isVFocus(focus)){
    throw new Error('Only a valid VFocus can be passes to hasNoTextChildren');
  }

  return flatten(focus).filter(isVText).every(isEmpty);
};
