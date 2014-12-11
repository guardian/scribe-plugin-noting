var path = require('path');
var _ = require('lodash');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');
var VText = require('vtree/vtext');
var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));

var createNoteAtCaret = require(path.resolve(process.cwd(), 'src/actions/noting/create-note-at-caret'));

describe('createNoteAtCaret()', function() {

  it('should create an empty note at the caret', function() {

    var tree = h('p', [
      h('em.scribe-marker'),
      new VText('This is some text')
    ]);
    tree = new VFocus(tree);
    createNoteAtCaret(tree);

    var noteNode = tree.next().vNode;

    expect(noteNode.tagName).to.equal('gu-note');
    expect(noteNode.properties.className.match(/note--start/g).length).to.equal(1);
    expect(noteNode.properties.className.match(/note--end/g).length).to.equal(1);

  });

  it('should create a note between segments', function(){

    var firstNote = h('gu-note', [h('p', 'text')]);
    var lastNote = h('gu-note', [h('p', 'text')]);
    var tree = h('div', [
      firstNote,
      h('em.scribe-marker'),
      lastNote
    ]);
    tree = new VFocus(tree);
    createNoteAtCaret(tree);

    var middleNote = tree.next().next().next().next();

    expect(middleNote.vNode.tagName).to.equal('gu-note');
    expect(firstNote.properties.className.match(/note--start/g).length).to.equal(1);
    expect(lastNote.properties.className.match(/note--end/g).length).to.equal(1);

  })

});
