var path = require('path');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');

var addClass = require(path.resolve(process.cwd(), 'src/actions/vdom/add-class'));

var div;
beforeEach(function() {
  div = h('.my-class');
});

describe('addClass()', function() {

  it('should return the vNode if it already contains a given class', function() {
    div = addClass(div, 'my-class');
    expect(div.properties.className).to.equal('my-class');
  });

  it('should add a class to a vNode', function() {
    div = addClass(div, 'my-class-2');
    expect(div.properties.className).to.equal('my-class my-class-2');
  });

});
