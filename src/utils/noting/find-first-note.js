var _ = require('lodash');
var isVFocus = require('../vfocus/is-vfocus');
var isWithinNote = require('./is-within-note');
var isNote = require('./is-note');

module.exports = function findFirstNote(focus){
  if(!isVFocus(focus)){
    throw new Error('only a valid vfocus can be passed to findFirstNote');
  }

  return _.last(
    focus.takeWhile(isWithinNote, 'prev').filter(isNote)
  );


};
