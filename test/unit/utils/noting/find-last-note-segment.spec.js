var path = require('path');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');

var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));
var findLastNote = require(path.resolve(process.cwd(), 'src/utils/noting/find-last-note-segment'));

describe('findLastNote()', function() {

  it('should return undefined if no notes are present', function() {

    var tree = new VFocus(h('div', [h('div'), h('p')]));
    expect(findLastNote(tree)).to.be.an('undefined');

  });

  it('should return the parent note seqment', function() {

    var segment1 = h('gu-note');
    var segment2 = h('gu-note', [h('div'), h('p')]);

    var tree = new VFocus(h('div', [
      segment2,
      segment1
    ]));

    var p = tree.next().next().next().next();
    var result = findLastNote(p);

    expect(result.vNode).to.equal(segment1);

  });

});
