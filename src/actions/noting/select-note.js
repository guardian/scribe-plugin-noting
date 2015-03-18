var isVFocus = require('../../utils/vfocus/is-vfocus');
var config = require('../../config');
var errorHandle = require('../../utils/error-handle');
var findEntireNote = require('../../utils/noting/find-entire-note');
var removeScribeMarkers = require('./remove-scribe-markers');
var createVirtualScribeMarker = require('../../utils/create-virtual-scribe-marker');

/**
 * Selects a whole note.
 *
 * Keep in mind that selection is an action that modifies the virtual DOM.
 * Make sure you don't keep references to old selections after calling this function,
 * as running this will clear any existing selection and instead select the note.
 * @param  {VFocus} noteSegment
 * @param  {String} tagName
 */
module.exports = function selectNote(noteSegment, tagName = config.get('defaultTagName')){
  if (!isVFocus(noteSegment)) {
    errorHandle('Only a valid VFocus element can be passed to selectNote, you passed: %s', noteSegment);
  }

  var noteSegments = findEntireNote(noteSegment, tagName);
  removeScribeMarkers(noteSegment);

  noteSegments[0].prependChildren(createVirtualScribeMarker());
  noteSegments.splice(-1)[0].addChild(createVirtualScribeMarker());
}
