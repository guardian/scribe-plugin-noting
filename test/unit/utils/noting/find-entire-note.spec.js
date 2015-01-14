var path = require('path');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');
var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));

var findEntireNote = require(path.resolve(process.cwd(), 'src/utils/noting/find-entire-note'));

var tree;
beforeEach(function() {
  tree = h('div', [
      h('gu-note'),
      h('gu-note', [h('div'), h('div')]),
      h('gu-note'),
    ]);
  tree = new VFocus(tree);
});

describe('findEntireNote()', function() {

  it('should return undefined if no note is present', function() {
    var div = new VFocus(h('div'));
    expect(findEntireNote(div)).to.be.an('undefined');
  });

  it('should return the note', function() {
    var note = new VFocus(h('gu-note', [h('div'), h('div')]));
    var result = findEntireNote(note);

    expect(result.length).to.equal(1);
    expect(result[0].vNode.tagName).to.equal('gu-note');
  });

  it('should return an array of note segments', function() {
    var result = findEntireNote(tree.next().next().next());
    expect(result.length).to.equal(3);
    expect(result[1].vNode.children.length).to.equal(2);
  });

});
