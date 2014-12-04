var path = require('path');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');
var VText = require('vtree/vtext');

var hasNoTextChildren = require(path.resolve(process.cwd(), 'src/utils/vfocus/has-no-text-children'));
var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));

describe('hasOnlyEmptyTextChildren()', function() {

  it('should return false if a tree contains text elements containing text', function() {
     var tree = new VFocus(h('div', [new VText('text'), new VText('text2')]));
      expect(hasNoTextChildren(tree)).to.be.false;
  });

  it('should return true if a tree contains text elements containing no text', function() {
    var tree = new VFocus(h('div', [h('p'), h('p')]));
    expect(hasNoTextChildren(tree)).to.be.true;

  });


});
