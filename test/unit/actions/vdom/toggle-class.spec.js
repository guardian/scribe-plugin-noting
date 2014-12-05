var path = require('path');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');

var toggleClass = require(path.resolve(process.cwd(), 'src/actions/vdom/toggle-class'));

var div;
beforeEach(function() {
  div = h('.my-class');
});

describe('toggle()', function() {

  it('should toggle a class on a given vNode', function() {

    div = toggleClass(div, 'my-class');
    expect(div.properties.className).to.equal('');

    div = toggleClass(div, 'my-class');
    expect(div.properties.className).to.equal('my-class');

  });

});
