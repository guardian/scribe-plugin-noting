var path = require('path');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');
var VText = require('vtree/vtext');
var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));


describe('VFocus - Checks', function() {

  var treeFocus;
  beforeEach(function() {
    var tree = h('div', [
      h('p', [
        h('b', [
          new VText('Some bolded text')
        ]),
        new VText('This is some text')
      ]),
      h('p', [
        new VText('This is some more text')
      ])
    ]);

    treeFocus = new VFocus(tree);
  });


  describe('isRoot()', function() {

    it('returns true when focusing on a root node', function() {
      expect(treeFocus.isRoot()).to.be.true;
    });

    it('returns false when not focusing on a root node', function() {
      var nonRootFocuses = treeFocus.next();

      nonRootFocuses.forEach(function(focus) {
        expect(focus.isRoot()).to.be.false;
      });
    });

  });


  describe('canRight()', function() {

    it('returns true when there is a node to the right', function() {
      var focus = treeFocus.down().down();

      expect(focus.canRight()).to.be.true;
    });

    it('returns false when there is no node to the right', function() {
      var focus = treeFocus.down().down().right();

      expect(focus.canRight()).to.be.false;
    });

  });


  describe('canLeft()', function() {

    it('returns true when there is a node to the left', function() {
      var focus = treeFocus.down().down().right();

      expect(focus.canLeft()).to.be.true;
    });

    it('returns false when there is no node to the left()', function() {
      var focus = treeFocus.down().down();

      expect(focus.canLeft()).to.be.false;
    });

  });


  describe('canDown()', function() {

    var top, bottom;
    beforeEach(function() {
      var canDownTree = h('div', [
        h('p')
      ]);

      top = canDownTree;
      bottom = canDownTree.children[0];
    });


    it('returns true when there is a node below', function() {
      var focus = new VFocus(top);

      expect(focus.canDown()).to.be.true;
    });

    it('returns false when there is no node below', function() {
      // To not make this function rely on `down()` (and `canDown()` by
      // extension) we specify the parent explicitly. Don't try this at home.
      var focus = new VFocus(bottom, top);

      expect(focus.canDown()).to.be.false;
    });

  });


  describe('canUp()', function() {

    var top, bottom;
    beforeEach(function() {
      var canUpTree = h('div', [
        h('p')
      ]);

      top = canUpTree;
      bottom = canUpTree.children[0];
    });


    it('returns true when there is a node above', function() {
      // To not make this function rely on `down()` (and `canDown()` by
      // extension) we specify the parent explicitly. Don't try this at home.
      var focus = new VFocus(bottom, top);

      expect(focus.canUp()).to.be.true;
    });

    it('returns false when there is no node above', function() {
      var focus = new VFocus(top);

      expect(focus.canUp()).to.be.false;
    });

  });


});
