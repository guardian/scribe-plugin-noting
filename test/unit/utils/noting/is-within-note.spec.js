var path = require('path');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');
var VText = require('vtree/vtext');

var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));
var isWithinNote = require(path.resolve(process.cwd(), 'src/utils/noting/is-within-note'))



describe('isWithinNote()', function() {

  it('should identify when a focus is not contained within a note', function() {
    var p = new VText('This is some text');
    p = new VFocus(p);
    expect(isWithinNote(p)).to.be.false;
  });


  it('should identify when a focus is contained within a note', function() {
    var div = h('div')
    var note = new VFocus(h('gu-note', [div]));
    expect(isWithinNote(note.next())).to.be.true;
  });

});
