var path = require('path');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');
var VText = require('vtree/vtext');
var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));


var removeEmptyNotes = require(path.resolve(process.cwd(), 'src/actions/noting/remove-empty-notes'));
var flattenTree = require(path.resolve(process.cwd(), 'src/utils/vfocus/flatten-tree'));

describe('removeEmptyNotes()', function() {

  it('should do nothing if a tree contains no notes', function() {
    var div = new VFocus(h('div'));
    removeEmptyNotes(div);
    expect(div).to.equal(div);
  });


  it('should remove all empty notes', function() {

    var tree = h('div', [
      h('gu-note'),
      h('gu-note')
    ]);


    tree = new VFocus(tree);
    removeEmptyNotes(tree);

    expect(tree.vNode.children.length).to.equal(0);

  });

  it('should leave notes where some child is non-empty', function() {
    var tree = h('div', [
      h('gu-note'),
      h('gu-note', [
        new VText('This is some text'),
        new VText('This is some text'),
        new VText('')
      ]),
      h('gu-note')
    ])
    tree = new VFocus(tree);

    removeEmptyNotes(tree);

    expect(tree.vNode.children.length).to.equal(1);

  })

});
