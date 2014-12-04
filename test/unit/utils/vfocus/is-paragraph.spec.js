var path = require('path');
var chai = require('chai');
var h = require('virtual-hyperscript');

var expect = chai.expect;

var isParagraph = require(path.resolve(process.cwd(), 'src/utils/vfocus/is-paragraph'));
var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));

describe('isParagraph()', function(){

  it('should correctly  identify  paragraph virtual node', function(){
    var p = new VFocus(h('p'));
    expect(isParagraph(p)).to.be.true;
  });

  it('should ', function(){
    var div = new VFocus(h('div'));
    expect(isParagraph(div)).to.be.false;
  });

});

