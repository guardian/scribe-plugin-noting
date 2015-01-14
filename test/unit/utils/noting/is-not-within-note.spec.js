var path = require('path');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');

var isNotWithinNote = require(path.resolve(process.cwd(), 'src/utils/noting/is-not-within-note'));
var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));

var note;
var div;

beforeEach(function(){
  div = h('div', [h('div'), h('div')]);
  div = new VFocus(div);

  note = h('gu-note', [h('div'), h('div')]);
  note = new VFocus(note);
});

describe('findParentNote()', function(){

  it('should return false when a VFocus is within a note', function(){
    expect(isNotWithinNote(note)).to.be.false;
  });

  it('should return true when a VFocus is not within a note', function(){
    expect(isNotWithinNote(div)).to.be.true;
  });

});
