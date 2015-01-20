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

 describe('next()', function() {

  var nextTreeFocus, nextTree, firstNode, secondNode, thirdNode, fourthNode;
  beforeEach(function() {
    nextTree = h(
      'div', [
        h('p#1', [
          h('b#2'),
          h('i#3')
        ]),
        h('p#4')
    ]);
    
    firstNode = nextTree.children[0];
    secondNode = firstNode.children[0];
    thirdNode = firstNode.children[1];
    fourthNode = nextTree.children[1];

    nextTreeFocus = new VFocus(nextTree);
  });

   it('focuses next nodes in the right order', function() {
    var firstNextFocus = nextTreeFocus.next();
    expect(firstNextFocus.vNode).to.equal(firstNode);

    var secondNextFocus = firstNextFocus.next();
    expect(secondNextFocus.vNode).to.equal(secondNode);

    var thirdNextFocus = secondNextFocus.next();
    expect(thirdNextFocus.vNode).to.equal(thirdNode);

    var fourthNextFocus = thirdNextFocus.next();
    expect(fourthNextFocus.vNode).to.equal(fourthNode);
   });
 });

  describe('prev()', function() {

    var prevTreeFocus, prevTree, firstNode, secondNode, thirdNode, fourthNode;
    beforeEach(function() {
      prevTree = h(
        'div', [
          h('p#4', [
            h('b#3'),
            h('i#2')
          ]),
          h('p#1')
      ]);
          
      firstNode = prevTree.children[1];
      fourthNode = prevTree.children[0];
      secondNode = fourthNode.children[1];
      thirdNode = fourthNode.children[0];

      prevTreeFocus = new VFocus(prevTree);
    });

    it('focuses prev nodes in the right order', function() {
      // go to the last element of the three
      var firstPrevFocus = prevTreeFocus.next().next().next().next();
      expect(firstPrevFocus.vNode).to.equal(firstNode);

      var secondPrevFocus = firstPrevFocus.prev();
      expect(secondPrevFocus.vNode).to.equal(secondNode);

      var thirdPrevFocus = secondPrevFocus.prev();
      expect(thirdPrevFocus.vNode).to.equal(thirdNode);

      var fourthPrevFocus = thirdPrevFocus.prev();
      expect(fourthPrevFocus.vNode).to.equal(fourthNode);
    });
  });

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