var path = require('path');
var chai = require('chai');
var expect = chai.expect;
var h = require('virtual-hyperscript');

var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));

var isNoteSegment = require(path.resolve(process.cwd(), 'src/utils/noting/is-note-segment'));

var divFocus;
var noteFocus;

beforeEach(function(){
  divFocus = new VFocus(h('div'));
  noteFocus = new VFocus(h('gu-note'));
});

describe('isNoteSegment()', function(){

  it('should correctly identify a note element', function(){
    expect(isNoteSegment(noteFocus)).to.be.true;
  });

  it('should correctly identify an element which is not a note', function(){
    expect(isNoteSegment(divFocus)).to.be.false;
  });

});
