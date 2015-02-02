var path = require('path');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');
var VText = require('vtree/vtext');

var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));
var isSelectionWithinNote = require(path.resolve(process.cwd(), 'src/utils/noting/is-selection-within-note'));

describe('isSelectionWithinNote()', function() {

  it('should return undefined if no markers are passed', function() {
    var div = new VFocus(h('div'));
    expect(isSelectionWithinNote(div)).to.be.an('undefined');
  });

  it('should return true when a selection is within a note', function() {

    var tree = h('gu-note', [
      h('em.scribe-marker'),
      new VText('This is some text'),
      h('em.scribe-marker')
    ])
    tree = new VFocus(tree);

    expect(isSelectionWithinNote(tree)).to.be.true;

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

    expect(isSelectionWithinNote(tree)).to.be.false;

  });

  it('should identify when the caret is within a note', function(){
    var marker = h('em.scribe-marker');
    var tree = h('gu-note', [
      marker
    ]);
    tree = new VFocus(tree);
    expect(isSelectionWithinNote(tree)).to.be.true;
  });


  it('should identify when a note is within a selection', function(){
    var tree = h('p', [
      new VText('This'),
      h('em.scribe-marker'),
      new VText('is'),
      h('gu-note', [
        new VText('some'),
      ]),
      h('em.scribe-marker'),
      new VText('content')
    ]);

    tree = new VFocus(tree);
    var result = isSelectionWithinNote(tree);
    expect(result).to.be.true;
  });

  it('should identify when a selection spans a note on the right hand side', function(){
    var tree = h('p', [
      new VText('This'),
      new VText('is'),
      h('gu-note', [
        h('em.scribe-marker'),
        new VText('some'),
      ]),
      new VText('content'),
      h('em.scribe-marker')
    ]);

    tree = new VFocus(tree);
    var result = isSelectionWithinNote(tree);
    expect(result).to.be.true;
  });



});
