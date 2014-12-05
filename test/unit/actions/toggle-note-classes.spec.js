var path = require('path');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');

var toggleNoteClasses = require(path.resolve(process.cwd(), 'src/actions/noting/toggle-note-classes'));

describe('toggleClass()', function() {

  it('should toggle a class on all notes', function() {

    var notes = [
      h('gu-note'),
      h('gu-note'),
      h('gu-note')
    ];

    toggleNoteClasses(notes, 'my-class');

    notes.forEach(function(note) {
      expect(note.properties.className).to.equal('my-class');
    });

    toggleNoteClasses(notes, 'my-class');

    notes.forEach(function(note) {
      expect(note.properties.className).to.equal('');
    });

  });

});
