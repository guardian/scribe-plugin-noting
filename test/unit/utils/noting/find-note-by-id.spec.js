var path = require('path');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');
var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));

var findNoteById = require(path.resolve(process.cwd(), 'src/utils/noting/find-note-by-id'));

describe('findNoteById()', function() {

  it('should return a new array if a focus contains no notes', function() {
    var div = new VFocus(h('div'));
    expect(findNoteById(div).length).to.equal(0);
  });

  it('should return the correct number of notes', function(){
    var tree = h('div', [
      h('gu-note', {'data-note-id': 1}),
      h('gu-note', {'data-note-id': 2}),
      h('gu-note', {'data-note-id': 1})
    ]);
    tree = new VFocus(tree);
    expect(findNoteById(tree, 1).length).to.equal(2);
    expect(findNoteById(tree, 2).length).to.equal(1);
  });

});
