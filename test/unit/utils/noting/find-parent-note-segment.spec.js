var path = require('path');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');

var findParentNoteSegment = require(path.resolve(process.cwd(), 'src/utils/noting/find-parent-note-segment'));
var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));

describe('findParentNoteSegment()', function(){

  it('should return a new VFocus containing a note', function(){

    var div = h('div');
    var note = h('gu-note', [div]);
    var focus = new VFocus(note);

    expect(findParentNoteSegment(focus.next()).vNode).to.equal(note);
    expect(findParentNoteSegment(focus.next()).vNode).not.to.equal(div);

  });
});
