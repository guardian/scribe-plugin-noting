var path = require('path');
var _ = require('lodash');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');
var VText = require('vtree/vtext');
var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));


var removeScribemarkers = require(path.resolve(process.cwd(), 'src/actions/noting/remove-scribe-markers'));
var flattenTree = require(path.resolve(process.cwd(), 'src/utils/vfocus/flatten-tree'));

describe('removeScribeMarkers()', function() {

  it('should do nothing is a tree contains no markers', function() {
    var div = new VFocus(h('div'));
    removeScribemarkers(div)
    expect(div).to.equal(div);
  });

  it('should remove all scribe markers from a tree', function() {
    var marker1 = h('em.scrine-marker');
    var marker2 = h('em.scrine-marker');

    var tree = h('div', [
      marker1,
      new VText('This is some text'),
      marker2
    ])
    tree = new VFocus(tree);

    removeScribemarkers(tree);
    tree = flattenTree(tree);

    expect(_.contains(tree, marker1)).to.be.false;
    expect(_.contains(tree, marker2)).to.be.false;

  });

});
