var path = require('path');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');

var addAttribute = require(path.resolve(process.cwd(), 'src/actions/vdom/add-attribute'));

describe('addAttribute()', function() {

  it('should set a normal attribute', function() {
    var div = h('div');
    addAttribute(div, 'title', 'This is a div');
    expect(div.properties.title).to.equal('This is a div');
  });

  it('should set a data attribute', function(){
    var div = h('div');
    addAttribute(div, 'data-component-type', 'div');
    expect(div.properties.dataset.componentType).to.equal('div');
  })
});
