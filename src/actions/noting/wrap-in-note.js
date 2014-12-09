var TAG = 'gu-note';
var CLASS_NAME = 'note';

var _ = require('lodash');
var h = require('virtual-hyperscript');

var getUKDate = require('../../utils/get-uk-date');

// Wrap in a note.
// toWrap can be a vNode, DOM node or a string. One or an array with several.
module.exports = function wrapInNote(focus, data){

  var notes = _.isArray(focus) ? focus : [focus];

  // Note that we have to clone dataAttrs or several notes might end up
  // sharing the same dataset object.
  data = data ? _.clone(data) : {};

  var tagName = TAG + '.' + CLASS_NAME;

  return h(tagName, {title: getUKDate(data), dataset: data}, notes);

};
