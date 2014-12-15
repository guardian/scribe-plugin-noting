var path = require('path');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');
var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));
var VText = require('vtree/vtext');

var findFirstNoteSegmentAbove = require(path.resolve(process.cwd(), 'src/utils/noting/find-previous-note-segment'));


describe('findFirstNoteSegmentAbove()', function() {

  it('should return the first note segment above a given VFocus', function() {

    var selection = h('p', [new VText('This is some text')]);
    var note = h('gu-note');
    var tree = h('div', [
      h('p'),
      note,
      h('p'),
      selection
    ]);
    tree = new VFocus(tree);

    var focus = new VFocus(selection, tree);

    var noteSegment = findFirstNoteSegmentAbove(focus);

    expect(noteSegment.vNode).to.equal(note);

  });
});
