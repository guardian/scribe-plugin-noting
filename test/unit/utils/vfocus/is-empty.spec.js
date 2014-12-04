var path = require('path');
var chai = require('chai');
var expect = chai.expect;
var h = require('virtual-hyperscript');

var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));
var isEmptyVFocus = require(path.resolve(process.cwd(), 'src/utils/vfocus/is-empty'));

var emptyP;
var containerP;

beforeEach(function() {
  emptyP = new VFocus(h('p'));
  containerP = new VFocus(h('p', 'This is some text'));
});

describe('vfocus isEmpty()', function() {

  it('should correctly identify an empty VFocus', function() {
    expect(isEmptyVFocus(emptyP)).to.be.true;
  });

  it('should corectly identify a VFocus with children', function(){
    expect(isEmptyVFocus(containerP)).to.be.false;
  });

});
