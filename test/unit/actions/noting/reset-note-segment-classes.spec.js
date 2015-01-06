var path = require('path');
var _ = require('lodash');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');
var VText = require('vtree/vtext');
var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));
var hasClass = require(path.resolve(process.cwd(), 'src/utils/vdom/has-class'));

var resetNoteSegmentClasses = require(path.resolve(process.cwd(), 'src/actions/noting/reset-note-segment-classes'));

describe('resetNoteSegmentClasses()', function() {

  it('should add note--start & note--end to a single note', function(){
    var note = new VFocus(h('gu-note'));
    var result = resetNoteSegmentClasses(note);
    expect(hasClass(result[0].vNode, 'note--start')).to.be.true;
    expect(hasClass(result[0].vNode, 'note--end')).to.be.true;
    expect(result[0].vNode.properties.title).not.to.be.an('undefined');
  })

  it('should add/remove the correct note--start note--end classes on an array of note sements', function() {

    var noteSegments = [
      new VFocus(h('gu-note')),
      new VFocus(h('gu-note')),
      new VFocus(h('gu-note'))
    ]

    noteSegments = resetNoteSegmentClasses(noteSegments);

    //check classes
    expect(hasClass(noteSegments[0].vNode, 'note--start')).to.be.true;
    expect(hasClass(noteSegments[0].vNode, 'note--end')).to.be.false;

    expect(hasClass(noteSegments[1].vNode, 'note--start')).to.be.false;
    expect(hasClass(noteSegments[1].vNode,  'note--end')).to.be.false;

    expect(hasClass(noteSegments[2].vNode, 'note--start')).to.be.false;
    expect(hasClass(noteSegments[2].vNode,  'note--end')).to.be.true;

  });
});
