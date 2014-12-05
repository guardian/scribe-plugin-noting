var path = require('path');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');

var removeClass = require(path.resolve(process.cwd(), 'src/actions/vdom/remove-class'));

var div;
beforeEach(function(){
  div = h('.my-class');
});

describe('removeClass()', function() {

  it('should return the vNode if it does not contain the given class', function() {
    div = removeClass(div, 'my-class-2');
    expect(div.properties.className).to.equal('my-class');
  });

  it('should remove the class if it exists on the VNode', function(){
    div = removeClass(div, 'my-class');
    expect(div.properties.className).to.equal('');
  });

});
