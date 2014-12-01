var path = require('path');
var chai = require('chai');
var expect = chai.expect;
var h  = require('virtual-hyperscript');

var hasClass = require(path.resolve(process.cwd(), 'src/utils/vdom/has-class'));

describe('hasClass()', function() {

  it('should return true if a vTree contains a give class', function() {
    var div = h('div.my-class1');
    expect(hasClass(div, 'my-class1')).to.be.true;
    expect(hasClass(div, 'my-class2')).to.be.false;
  });

  it('should return true for multiple classes', function (){
    var div = h('div.my-class1.my-class2');
    expect(hasClass(div, 'my-class1')).to.be.true;
    expect(hasClass(div, 'my-class2')).to.be.true;
  });

});
