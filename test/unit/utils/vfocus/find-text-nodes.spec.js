var path = require('path');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');
var VText = require('vtree/vtext');

var findTextNodes = require(path.resolve(process.cwd(), 'src/utils/vfocus/find-text-nodes'));
var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));

var text1;
var text2;
var div;

beforeEach(function() {
  text1 = new VText('This is some text');
  text1 = new VFocus(text1);

  text2 = new VText('This is some text2');
  text2 = new VFocus(text2);

  div = h('div');
  div = new VFocus(div);
});

describe('findTextNodes()', function() {

  it('should return and array of text nodes from a given focus', function() {

    var nodes = findTextNodes([text1, text2, div]);

    expect(nodes.length).to.equal(2);
    expect(nodes[0]).to.equal(text1);
    expect(nodes[1]).to.equal(text2);

  });

  it('should return an empty array if no vTexts are passed', function() {
    expect(findTextNodes(div).length).to.equal(0);
  });

});
