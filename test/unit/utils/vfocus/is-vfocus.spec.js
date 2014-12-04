var path = require('path');
var chai = require('chai');
var webdriver = require('selenium-webdriver');
var h = require('virtual-hyperscript');

var expect = chai.expect;

var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));
var isVFocus = require(path.resolve(process.cwd(), 'src/utils/vfocus/is-vfocus'));

var domTree;
var focus;

beforeEach(function(){
  domTree = h('div');
  focus = new VFocus(domTree);
})

describe('isVFocus()', function(){

  it('should return true for a valid vFocus', function(){
    expect(isVFocus(focus)).to.be.true;
  });

  it('should return false for an invalid vFocus', function(){
    expect(isVFocus(domTree)).to.be.false;
  })

})
