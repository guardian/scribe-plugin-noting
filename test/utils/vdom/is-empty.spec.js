var path = require('path');
var chai = require('chai');
var expect = chai.expect;
var h = require('virtual-hyperscript');

var isEmpty = require(path.resolve(process.cwd(), 'src/utils/vdom/is-empty'));

describe('isEmpty Util', function(){

  it('should correctly identify nodes which are empty', function(){

    var div = h('div');
    var p = h('p');

    expect(isEmpty(div)).to.be.true;
    expect(isEmpty(p)).to.be.true;

  });

  it('should correctly identify nodes which are not  empty', function(){

    var div = h('div', h('div'));
    var p = h('p', 'This is some text');

    expect(isEmpty(div)).to.be.false;
    expect(isEmpty(p)).to.be.false;

  });

});
