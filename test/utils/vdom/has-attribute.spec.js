var path = require('path');
var chai = require('chai');
var expect = chai.expect;
var h = require('virtual-hyperscript');

var hasAttribute = require(path.resolve(process.cwd(), 'src/utils/vdom/has-attribute'));

describe.only('hasAttribute()', function() {

  it('should return true for valid attributes', function() {

    var div = h('div', {
      dataset: {
        'data-component': 'my-component'
      },
      'title': 'This is a title'
    });

    expect(hasAttribute(div, 'title', 'This is a title')).to.be.true;
    expect(hasAttribute(div, 'data-component', 'my-component')).to.be.true;

  });

  it('should return false for in-valid attributes', function() {

    var div = h('div');
    expect(hasAttribute(div, 'title', 'This is a title')).to.be.false;
    expect(hasAttribute(div, 'data-component', 'my-component')).to.be.false;

  });
});
