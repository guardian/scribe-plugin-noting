var path = require('path');
var _ = require('lodash');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');
var VText = require('vtree/vtext');
var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));


describe('VFocus - Mutations', function() {

  describe('replace()', function() {

    var replaceTree, replaceTreeFocus, replaceRootNode, replaceNode;
    
    beforeEach(function() {
      replaceTree = h('div', [
        h('p#1')
      ]);

      replaceRootNode = h('div');

      replaceNode = h('p', [
        h('b')
      ]);

      replaceTreeFocus = new VFocus(replaceTree);
    });

    it('replaces and focuses the root node', function() {
      var returnedRootVFocus = replaceTreeFocus.replace(replaceRootNode);
    
      expect(returnedRootVFocus.vNode).to.equal(replaceRootNode);
    });

    it('replaces the node in focus', function() {
      var returnedVFocus = replaceTreeFocus.down().replace(replaceNode);

      expect(replaceNode).to.equal(returnedVFocus.vNode);
    });

  });

  describe('remove()', function() {

    var removeTree, removeTreeFocus;
    beforeEach(function() {
      removeTree = h('div', [
        h('p')
      ]);

      removeTreeFocus = new VFocus(removeTree);
    });

    it('does not remove the root node', function() {
      var returnedTreeFocus = removeTreeFocus.remove();

      expect(removeTreeFocus).to.deep.equal(returnedTreeFocus);
    });

    it.only('removes correctly the node', function() {
      var expectedTreeFocus = new VFocus(h('div'));
      var returnedTreeFocus = removeTreeFocus.down().remove();

      expect(removeTreeFocus.vNode.children).to.be.empty;
    });

  });

});