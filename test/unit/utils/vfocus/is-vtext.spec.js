var path = require('path');
var chai = require('chai');
var expect = chai.expect;
var h = require('virtual-hyperscript');

var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));
var isVText = require(path.resolve(process.cwd(), 'src/utils/vfocus/is-vtext'));

var div;
var textFocus;

beforeEach(function(){
  div = new VFocus(h('div'));
  textFocus = new VFocus(h('p', 'this is some text').children[0]);
});

describe('isVText()', function(){

  it('should correctly identify vtext', function(){
    expect(isVText(textFocus)).to.be.true;
  });

  it('should correctly identify a node whicih is not vText', function(){
    expect(isVText(div)).to.be.false;
  })

})
