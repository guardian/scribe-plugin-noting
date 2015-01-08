var path = require('path');
var _ = require('lodash');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');
var VText = require('vtree/vtext');

var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));

var findAllNotes = require(path.resolve(process.cwd(), 'src/utils/noting/find-all-notes'));

describe('findAllNotes()', function() {

  it('should return a new array if no note is present', function() {
    var div = new VFocus(h('div'));
    expect(findAllNotes(div).length).to.equal(0);
  });

  it('should return a note if one is present', function() {
    var tree = h('div', [
      h('gu-note')
    ]);
    tree = new VFocus(tree);
    expect(findAllNotes(tree).length).to.equal(1);
  });

  it('should return all notes within a tree', function(){
    var tree = h('div', [
      h('gu-note'),
      h('div'),
      h('p', [h('gu-note', [
        new VText('This is some text'),
        new VText('This is some text')
      ])])
    ]);
    tree = new VFocus(tree);

    var result = _.flatten(findAllNotes(tree));
    expect(result.length).to.equal(2);
  });

});
