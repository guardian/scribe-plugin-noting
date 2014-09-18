var vdom = require('./note-vdom');

var NOTE_CLASS_COLLAPSED = 'note--collapsed';

// TODO: move this somewhere sharable
function toggleClass(vNode, className, state) {
  var classes = vNode.properties.className.split(' '),

  existingIdx = classes.indexOf(className);

  if (~existingIdx) { // class exists
    if (state !== true) {
      classes.splice(existingIdx, 1);
    }

  } else if (state !== false) { // class doesn't exist
    classes.push(className);
  }

  vNode.properties.className = classes.join(' ');
}



function toggleNotes(note, state) {
  if (Array.isArray(note)) {
    note.forEach(function(n) {
      toggleClass(n.vNode, NOTE_CLASS_COLLAPSED, state);
    });

  } else {
    toggleClass(note.vNode, NOTE_CLASS_COLLAPSED, state);
  }
}


exports.collapseToggleSelectedNote = function collapseToggleSelectedNote(treeFocus) {
  var selectedNote = vdom.findSelectedNote(treeFocus);

  toggleNotes(selectedNote);

};

exports.collapseToggleAllNotes = function collapseToggleAllNotes(treeFocus, state) {
  vdom.findAllNotes(treeFocus).forEach(function(notes) { toggleNotes(notes, state); });
};
