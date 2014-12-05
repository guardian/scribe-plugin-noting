var vdom = require('./note-vdom');

var NOTE_CLASS_COLLAPSED = 'note--collapsed';
var hasClass = require('../utils/vdom/has-class');
var toggleClass = require('../actions/vdom/toggle-class');
var toggleNotes = require('../actions/noting/toggle-note-classes');
var findSelectedNote = require('../utils/noting/find-selected-note');
var findAllNotes = require('../utils/noting/find-all-notes');


exports.collapseToggleSelectedNote = function collapseToggleSelectedNote(treeFocus) {
  toggleNotes(findSelectedNote(treeFocus), NOTE_CLASS_COLLAPSED);
};

exports.collapseToggleAllNotes = function collapseToggleAllNotes(treeFocus) {
  toggleNotes(findAllNotes(treeFocus), NOTE_CLASS_COLLAPSED);
};
