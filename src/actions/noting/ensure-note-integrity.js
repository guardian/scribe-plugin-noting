var isVFocus = require('../../utils/vfocus/is-vfocus');
var errorHandle = require('../../utils/error-handle');
var noteCache = require('../../utils/noting/note-cache');
var mergeIfNecessary = require('./merge-if-necessary');
var resetNoteBarriers = require('./reset-note-barriers');
var removeErroneousBrTags = require('./remove-erroneous-br-tags');
var config = require('../../config');

module.exports = function ensureNoteIntegrity(focus, tagName = config.get('defaultTagName')){

  if (!isVFocus(focus)){
    errorhandle('Only a valid VFocus element can be passed to ensureNoteIntegrity, you passed: %s', focus);
  }

  noteCache.set(focus);
  mergeIfNecessary(focus, tagName);
  resetNoteBarriers(focus, tagName);
  removeErroneousBrTags(focus, tagName);

};
