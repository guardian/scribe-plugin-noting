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

    it('removes the node in focus correctly', function() {
      var expectedTreeFocus = new VFocus(h('div'));
      var returnedTreeFocus = removeTreeFocus.down().remove();

      expect(removeTreeFocus.vNode.children).to.be.empty;
    });

  });

  describe('insertBefore()', function() {

    var insertBeforeTree, insertBeforeTreeFocus, newNodes;
    beforeEach(function() {
      insertBeforeTree = h('div', [
        h('p#1')
      ]);

      newNodes = [h('p#0'), h('p#1')];
      insertBeforeTreeFocus = new VFocus(insertBeforeTree);
    });

    it('does not insert before the root node', function() {
      insertBeforeTreeFocus.insertBefore(newNodes);

      expect(insertBeforeTreeFocus.vNode.children.length).to.equal(1);
    });

    it('inserts the node before the node in focus', function() {
      insertBeforeTreeFocus.down().insertBefore(newNodes);

      expect(insertBeforeTreeFocus.vNode.children[0]).to.equal(newNodes[1]);
    });

  });

  describe('insertAfter()', function() {

    var insertAfterTree, insertAfterTreeFocus, newNodes;
    beforeEach(function() {
      insertAfterTree = h('div', [
        h('p#1'),
        h('p#2')
      ]);

      newNodes = [h('p#first'), h('p#last')];
      insertAfterTreeFocus = new VFocus(insertAfterTree);
    });

    it('does not insert new nodes after the root node', function() {
      insertAfterTreeFocus.insertAfter(newNodes);

      expect(insertAfterTreeFocus.vNode.children.length).to.equal(2);
    });

    it('inserts the new nodes after the last node', function() {
      insertAfterTreeFocus.next().next().insertAfter(newNodes);

      expect(insertAfterTreeFocus.vNode.children.length).to.equal(4);
    });

    it('inserts the new nodes before the next sibling', function() {
      insertAfterTreeFocus.next().insertAfter(newNodes);

      expect(insertAfterTreeFocus.vNode.children[1]).to.equal(newNodes[1]);
    });
  });

});