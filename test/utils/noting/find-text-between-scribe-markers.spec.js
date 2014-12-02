var path = require('path');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');
var VText = require('vtree/vtext');

var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));
var findBetweenScribeMarkers = require(path.resolve(process.cwd(), 'src/utils/noting/find-text-between-scribe-markers'));

var child1;
var child2;
var marker1;
var marker2;

beforeEach(function() {
  child1 = new VText('This is some text');
  child2 = h('div');
  marker1 = h('em.scribe-marker');
  marker2 = h('em.scribe-marker');
});

describe('findTextBetweenScribeMarkers()', function() {

  it('should return all elements between scribe markers', function(){

    var tree = new VFocus(h('div', [marker1, child1, child2, marker2]));

    var result = findBetweenScribeMarkers(tree);

    expect(result.length).to.equal(1);

    expect(result[0].vNode).to.equal(child1);
    expect(result[1]).to.be.an('undefined');

  });

});
