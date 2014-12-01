var path = require('path');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');

var findTextNodes = require(path.resolve(process.cwd(), 'src/utils/vfocus/find-text-nodes'));
var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));

var text1;
var text2;

beforeEach(function() {
  text1 = h('p', 'This is some text 1');
  text2 = h('p', 'This is some text 1');
});

describe('findTextNodes', function() {

  it('should return and array of text nodes from a given focus', function() {
    var div = h('div', [text1.children[0], text2.children[0]]);
    div = new VFocus(div);

    var nodes = findTextNodes(div);

    console.log('-----------------------');
    console.log(nodes, text1, text2);
    console.log('-----------------------');

    expect(nodes[0]).to.equal(text1);
    expect(nodes[1]).to.equal(text2);

  });

});
