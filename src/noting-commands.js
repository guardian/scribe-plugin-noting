/**
 * Noting commands
 *
 * Scribe noting commands.
 */

'use strict';

var noteToggle = require('./api/note-toggle');
var noteCollapse = require('./api/note-collapse');
var vdom = require('./noting-vdom');
var _ = require('lodash');
var configStore = require('./config');
var generateNoteController = require('./NoteController.js');

var scribeSelector;

/**
 * Initialise noting commands
 * @param  {Scribe} scribe
 * @param  {String} user  Current user string.
 */
exports.init = function(scribe, config) {
  var NoteController = generateNoteController(scribe, config);
};
