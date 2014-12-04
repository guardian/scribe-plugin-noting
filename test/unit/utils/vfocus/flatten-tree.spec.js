var path = require('path');
var chai = require('chai');
var expect = chai.expect;
var h = require('virtual-hyperscript');

var flattenTree = require(path.resolve(process.cwd(), 'src/utils/vfocus/flatten-tree'));
var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));

var parent;
var child;
var div1;
var div2;

beforeEach(function(){

  div1 = h('div');
  div2 = h('div');
  child = h('div', [div1, div2]);

  parent = h('div', [child]);
  parent= new VFocus(parent)
});

describe('flattenTree()', function() {

  it('should flatten a tree', function(){
    var result = flattenTree(parent);

    expect(result[0].vNode).to.equal(parent.vNode);
    expect(result[1].vNode).to.equal(child);
    expect(result[2].vNode).to.equal(div1);
    expect(result[3].vNode).to.equal(div2);

  });

  it('should flatten a sub tree', function(){
     var result = flattenTree(parent.next());

    expect(result[0].vNode).to.equal(child);
    expect(result[1].vNode).to.equal(div1);
    expect(result[2].vNode).to.equal(div2);

  });

});
