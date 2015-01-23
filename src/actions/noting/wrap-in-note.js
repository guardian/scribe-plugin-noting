var config = require('../../config');
var _ = require('lodash');
var h = require('virtual-hyperscript');

var getUKDate = require('../../utils/get-uk-date');

// Wrap in a note.
// toWrap can be a vNode, DOM node or a string. One or an array with several.
module.exports = function wrapInNote(focus, data){

  var notes = _.isArray(focus) ? focus : [focus];

  //data MUST be cloned as this can lead to multiple notes with the same note ID see:
  // https://github.com/guardian/scribe-plugin-noting/issues/45
  data = _.extend({}, (data || {}));

  var tagName = config.get('tagName') + '.' + config.get('className');

  return h(tagName, {title: getUKDate(data), dataset: data}, notes);

};
