var path = require('path');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');

var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));
var findBetweenScribeMarkers = require(path.resolve(process.cwd(), 'src/utils/noting/find-between-scribe-markers'));

var child1;
var child2;
var marker1;
var marker2;

beforeEach(function() {
  child1 = h('p');
  child2 = h('div');
  marker1 = h('em.scribe-marker');
  marker2 = h('em.scribe-marker');
});

describe('findBetweenScribeMarkers()', function() {

  it('should return an empty array if no scribe markers are present', function() {

    var tree = new VFocus(h('div', [child1, child2]));

    expect(findBetweenScribeMarkers(tree).length).to.equal(0);

  });

  it('should return all elements between scribe markers', function(){

    var tree = new VFocus(h('div', [marker1, child1, child2, marker2]));

    var result = findBetweenScribeMarkers(tree);

    expect(result.length).to.equal(2);

    expect(result[0].vNode).to.equal(child1);
    expect(result[1].vNode).to.equal(child2);

  });

});
