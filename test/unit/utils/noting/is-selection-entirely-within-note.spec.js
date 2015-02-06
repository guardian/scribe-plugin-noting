var path = require('path');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');
var VText = require('vtree/vtext');

var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));
var isSelectionEntirelyWithinNote = require(path.resolve(process.cwd(), 'src/utils/noting/is-selection-entirely-within-note'));

describe('isSelectionEntirelyWithinNote()', function() {

  it('should return undefined if no markers are passed', function() {
    var div = new VFocus(h('div'));
    expect(isSelectionEntirelyWithinNote(div)).to.be.an('undefined');
  });

  it('should return true when a selection is within a note', function() {

    var tree = h('gu-note', [
      h('em.scribe-marker'),
      new VText('This is some text'),
      h('em.scribe-marker')
    ])
    tree = new VFocus(tree);

    expect(isSelectionEntirelyWithinNote(tree)).to.be.true;

  });

  it('should return false when a selection is not within a note', function() {

    var tree = h('div', [
      h('gu-note'),
      h('p', [
        h('em.scribe-marker'),
        new VText('This is some text'),
        h('em.scribe-marker')
      ])
    ]);

    tree = new VFocus(tree);

    expect(isSelectionEntirelyWithinNote(tree)).to.be.false;

  });

});
