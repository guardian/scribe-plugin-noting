var path = require('path');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');
var VText = require('vtree/vtext');
var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));

var unWrapNote = require(path.resolve(process.cwd(), 'src/actions/noting/unwrap-note'));

describe('unWrapNote()', function() {

  it('should unwrap a note', function() {

    var note = h('gu-note', [
      new VText('This'),
      new VText('is'),
      new VText('some'),
      new VText('text'),
    ]);

    var div = new VFocus(h('div', [note]));

    var tree = new VFocus(note, div);
    tree = unWrapNote(tree);

    expect(tree.vNode.tagName).not.to.equal('gu-note');
    tree.vNode.children.forEach(function(child) {
      expect(child.tagName).not.to.equal('gu-note');
    });

  });


});
