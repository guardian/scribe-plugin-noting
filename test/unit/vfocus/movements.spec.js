var path = require('path');
var _ = require('lodash');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');
var VText = require('vtree/vtext');
var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));


// To keep these tests as simple as possible we consider previously run tests to have passed.
// For example, the `up()` tests rely on `down()` being correct.
describe('VFocus - Movements', function() {


  describe('down()', function() {

    var downTreeFocus, downTree;
    beforeEach(function() {
      downTree = h('div', [
        h('p')
      ]);

      downTreeFocus = new VFocus(downTree);
    });


    it('focuses the node below when there is one', function() {
      expect(downTreeFocus.down().vNode).to.equal(downTree.children[0]);
    });

    it('returns null when there is no node below', function() {
      // To not make this function rely on `down()`  we specify the parent
      // explicitly. Don't try this at home.
      var lastFocus = new VFocus(downTree.children[0], downTree);

      expect(lastFocus.down()).to.equal(null);
    });

  });


  describe('up()', function() {

    var upTreeFocus, upTree;
    beforeEach(function() {
      upTree = h('div', [
        h('p')
      ]);

      upTreeFocus = new VFocus(upTree);
    });


    it('focuses the node above when there is one', function() {
      var lastFocus = upTreeFocus.down()
      expect(lastFocus.up().vNode).to.equal(upTree);
    });

    it('returns null when there is no node above', function() {
      expect(upTreeFocus.up()).to.equal(null);
    });

  });


  describe('right()', function() {

    var rightTreeFocus, rightTree, lastParagraph;
    beforeEach(function() {
      rightTree = h('div', [
        h('p#first'),
        h('p#last')
      ]);

      lastParagraph = rightTree.children[rightTree.children.length - 1];
      rightTreeFocus = new VFocus(rightTree);
    });


    it('focuses the node to the right when there is one', function() {
      var firstParagraphFocus = rightTreeFocus.down();

      expect(firstParagraphFocus.right().vNode).to.equal(lastParagraph);
    });

    it('returns null when there is no node to the right', function() {
      // To not make this function rely on `right()` we specify the parent
      // explicitly. Don't try this at home.
      var lastParagraphFocus = new VFocus(lastParagraph, rightTree);

      expect(rightTreeFocus.right()).to.equal(null);
    });

  });


  describe('left()', function() {

    var leftTreeFocus, leftTree, firstParagraph;
    beforeEach(function() {
      leftTree = h('div', [
        h('p#first'),
        h('p#last')
      ]);

      firstParagraph = leftTree.children[0];
      leftTreeFocus = new VFocus(leftTree);
    });


    it('focuses the node to the left when there is one', function() {
      var secondParagraphFocus = leftTreeFocus.down().right();

      expect(secondParagraphFocus.left().vNode).to.equal(firstParagraph);
    });

    it('returns null when there is no node to the left', function() {
      var firstParagraphFocus = leftTreeFocus.down();

      expect(firstParagraphFocus.left()).to.equal(null);
    });

  });

  // TODO: Cover the different cases for next().

  // TODO: Cover the different cases for prev().

  describe('top()', function() {

    var topTreeFocus, topTree;
    beforeEach(function() {
      topTree = h('div', [
        h('p')
      ]);

      topTreeFocus = new VFocus(topTree);
    });


    it('focuses the top node when already focusing on it', function() {
      var lastFocus = topTreeFocus.down();

      expect(lastFocus.top().vNode).to.equal(topTree);
    });

    it('focuses the top node when focusing on a node that is not the top node', function() {
      expect(topTreeFocus.top().vNode).to.equal(topTree);
    });

  });


});
