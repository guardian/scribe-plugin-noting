var path = require('path');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');
var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));

var toggleNoteClasses = require(path.resolve(process.cwd(), 'src/actions/noting/toggle-note-classes'));

describe('toggleClass()', function() {

  it('should toggle a class on all notes', function() {

    const noteSegments = [
      new VFocus(h('gu-note')),
      new VFocus(h('gu-note')),
      new VFocus(h('gu-note'))
    ];

    toggleNoteClasses(noteSegments, 'my-class');

    noteSegments.forEach(function(noteSegment) {
      expect(noteSegment.vNode.properties.className).to.equal('my-class');
    });


    toggleNoteClasses(noteSegments, 'my-class');

    noteSegments.forEach(function(noteSegment) {
      expect(noteSegment.vNode.properties.className).to.equal('');
    });

  });

});
