var path = require('path');
var chai = require('chai');
var expect = chai.expect;
var h = require('virtual-hyperscript');

var isTag = require(path.resolve(process.cwd(), 'src/utils/vdom/is-tag'));

describe('isTag Util', function() {

  it('should identity a correct tag', function() {
    var div = h('div');
    var p = h('p');

    expect(isTag(div, 'div')).to.be.true;
    expect(isTag(p, 'p')).to.be.true;
  });

  it('should identity an incorrct tag', function() {
    var div = h('div');
    var p = h('p');

    expect(isTag(div, 'p')).to.be.false;
    expect(isTag(p, 'div')).to.be.false;
  })

})
