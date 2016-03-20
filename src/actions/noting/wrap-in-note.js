var assign = require('lodash.assign');

var config = require('../../config');
var h = require('virtual-hyperscript');

var getUKDate = require('../../utils/get-uk-date');

// Wrap in a note.
// toWrap can be a vNode, DOM node or a string. One or an array with several.
module.exports = function wrapInNote(focus, data, tagName = config.get('defaultTagName')){

  var notes = Array.isArray(focus) ? focus : [focus];

  //data MUST be cloned as this can lead to multiple notes with the same note ID see:
  // https://github.com/guardian/scribe-plugin-noting/issues/45
  data = assign({}, (data || {}));

  tagName = tagName + '.' + config.get('className');

  return h(tagName, {title: getUKDate(data), dataset: data}, notes);

};
