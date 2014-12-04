var path = require('path');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');

var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));
var findFirstNote = require(path.resolve(process.cwd(), 'src/utils/noting/find-first-note'));

var child1;
var child2;
var marker1;
var marker2;

describe('findFirstNote()', function() {

  it('should return undefined if no notes are present', function() {

    var tree = new VFocus(h('div', [h('div'), h('p')]));
    expect(findFirstNote(tree)).to.be.an('undefined');

  });

  it('should return the parent note seqment', function() {

    var segment1 = h('gu-note');
    var segment2 = h('gu-note', [h('div'), h('p')]);

    var tree = new VFocus(h('div', [
      segment1,
      segment2
    ]));

    var p = tree.next().next().next().next();
    var result = findFirstNote(p);

    expect(result.vNode).to.equal(segment1);

  });

});
