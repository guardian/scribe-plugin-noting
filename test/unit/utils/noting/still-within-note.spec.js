var path = require('path');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');
var VText = require('vtree/vtext');

var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));
var stillWithinNote = require(path.resolve(process.cwd(), 'src/utils/noting/still-within-note'))



describe('stillWithinNote()', function() {

  it('should identify when a focus is not contained within a note', function() {
    var p = new VText('This is some text');
    p = new VFocus(p);
    expect(stillWithinNote(p)).to.be.false;
  });


  it('should identify when a focus is contained within a note', function() {
    var div = h('div')
    var note = new VFocus(h('gu-note', [div]));
    expect(stillWithinNote(note.next())).to.be.true;
  });

});
