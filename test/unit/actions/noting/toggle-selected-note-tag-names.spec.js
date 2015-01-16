var path = require('path');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');
var VText = require('virtual-hyperscript');

var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));
var toggleSelectedNoteTagNames = require(path.resolve(process.cwd(), 'src/actions/noting/toggle-selected-note-tag-names'));

describe('toggleSelectedNoteTagNames()', function() {

  it('should toggle tag names on notes within a given tree', function() {

    var firstNote = h('gu-note');
    var secondNote = h('gu-flag', [
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

    toggleSelectedNoteTagNames(tree, 'gu-flag', 'gu-correct');


    expect(firstNote.tagName).to.equal('gu-note');
    //when converting dom nodes to virtual nodes the tag names are upper case
    //so we expect the returned tree's tag names to also be in upper case
    expect(secondNote.tagName).to.equal('GU-CORRECT');
    expect(thirdNote.tagName).to.equal('gu-note');

  });

});
