var path = require('path');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');
var VText = require('vtree/vtext');
var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));

var wrapInNote = require(path.resolve(process.cwd(), 'src/actions/noting/wrap-in-note'));

describe('wrapInNote()', function() {

  it('should wrap a selection in a note', function() {

    var tree = h('div', [
      h('em.scribe-marker'),
      new VText('This is some text'),
      h('em.scribe-marker'),
    ]);

    var note = wrapInNote(tree);

    expect(note.tagName).to.equal('gu-note');
    expect(note.children.length).to.equal(1);

  });

});
