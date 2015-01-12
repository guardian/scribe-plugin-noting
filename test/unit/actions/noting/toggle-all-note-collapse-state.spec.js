var path = require('path');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');
var VText = require('virtual-hyperscript');

var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));
var toggleSelectedNoteCollapseState = require(path.resolve(process.cwd(), 'src/actions/noting/toggle-all-note-collapse-state'));
var hasClass = require(path.resolve(process.cwd(), 'src/utils/vdom/has-class'));

describe('toggleAllNoteCollapseState()', function() {

  it('should toggle a class only on selected notes', function(){

    var firstNote = h('gu-note');
    var secondNote = h('gu-note', [
      h('em.scribe-marker'),
        new VText('This is some text'),
        h('em.scribe-marker')
      ]);
    var thirdNote = h('gu-note');

    var tree = h('div', [firstNote, secondNote, thirdNote]);

    tree = new VFocus(tree);

    toggleSelectedNoteCollapseState(tree);

    expect(hasClass(firstNote, 'note--collapsed')).to.be.true;
    expect(hasClass(secondNote, 'note--collapsed')).to.be.true;
    expect(hasClass(thirdNote, 'note--collapsed')).to.be.true;
  });

});
