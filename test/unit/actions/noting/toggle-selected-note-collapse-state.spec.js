var path = require('path');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');
var VText = require('virtual-hyperscript');

var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));
var toggleSelectedNoteCollapseState = require(path.resolve(process.cwd(), 'src/actions/noting/toggle-selected-note-collapse-state'));
var hasClass = require(path.resolve(process.cwd(), 'src/utils/vdom/has-class'));

describe('toggleSelectedNoteCollapseState()', function() {

  it('should toggle a class only on selected notes', function() {

    var firstNote = h('gu-note');
    var secondNote = h('gu-note', [
        h('em.scribe-marker'),
        new VText('This is some text'),
        h('em.scribe-marker')
      ]);
    var thirdNote = h('gu-note');

    var tree = h('div', [
      firstNote,
      h('p', 'text'),
      secondNote,
      h('p', 'text'),
      thirdNote
    ]);

    tree = new VFocus(tree);

    toggleSelectedNoteCollapseState(tree);

    expect(hasClass(firstNote, 'note--collapsed')).to.be.false;
    expect(hasClass(secondNote, 'note--collapsed')).to.be.true;
    expect(hasClass(thirdNote, 'note--collapsed')).to.be.false;

  });

  it('should not add a note--collapsed class if no note is selected', function(){

    var tree = h('div', [
      h('gu-note'),
      h('gu-note'),
      h('gu-note')
    ]);

    tree = new VFocus(tree);

    toggleSelectedNoteCollapseState(tree);

    expect(hasClass(tree.next(), 'note--collapsed')).to.be.false; //first-note
    expect(hasClass(tree.next().next(), 'note--collapsed')).to.be.false; //seccond-note
    expect(hasClass(tree.next().next().next(), 'note--collapsed')).to.be.false; //third-note

  });

});
