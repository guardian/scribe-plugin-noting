var path = require('path');
var chai = require('chai');
var expect = chai.expect;
var h = require('virtual-hyperscript');

var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));

var isNote = require(path.resolve(process.cwd(), 'src/utils/noting/is-note'));

var divFocus;
var noteFocus;

beforeEach(function(){
  divFocus = new VFocus(h('div'));
  noteFocus = new VFocus(h('gu-note'));
});

describe('isNote()', function(){

  it('should correctly identify a note element', function(){
    expect(isNote(noteFocus)).to.be.true;
  });

  it('should correctly identify an element which is not a note', function(){
    expect(isNote(divFocus)).to.be.false;
  });

});
