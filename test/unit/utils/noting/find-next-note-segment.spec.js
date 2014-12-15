var path = require('path');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');
var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));
var VText = require('vtree/vtext');

var findFirstNoteSegmentBelow = require(path.resolve(process.cwd(), 'src/utils/noting/find-next-note-segment'));


describe('findFirstNoteSegmentBelow()', function() {

  it('should return the first note segment below a given VFocus', function() {

    var selection = h('p', [new VText('This is some text')]);
    var note = h('gu-note');
    var tree = h('div', [
      h('p'),
      selection,
      h('p'),
      note
    ]);
    tree = new VFocus(tree);

    var focus = new VFocus(selection, tree);

    var noteSegment = findFirstNoteSegmentBelow(focus);

    expect(noteSegment.vNode).to.equal(note);

  });
});
