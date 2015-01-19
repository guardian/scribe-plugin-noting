var path = require('path');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');
var VText = require('vtree/vtext');

var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));
var isWithinNote = require(path.resolve(process.cwd(), 'src/utils/noting/is-within-note'))
var isVFocus = require(path.resolve(process.cwd(), 'src/utils/vfocus/is-vfocus'))



describe('isWithinNote()', function() {

  it('should identify when a selection is outside of a note', function(){
    var tree = h('p');

    tree = new VFocus(tree);
    var result = isWithinNote(tree);
    expect(result).to.be.false;
  });

  it('should identify when the caret is within a note', function(){
    var tree = h('gu-note', [
      h('em.scribe-marker')
    ]);

    tree = new VFocus(tree);
    var result = isWithinNote(tree);
    expect(result).to.be.true;
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
    var result = isWithinNote(tree);
    expect(result).to.be.true;
  });

  it('should identify when a selection spans a note on the left hand side', function(){
    var tree = h('p', [
      h('em.scribe-marker'),
      new VText('This'),
      new VText('is'),
      h('gu-note', [
        new VText('some'),
        h('em.scribe-marker')
      ]),
      new VText('content')
    ]);

    tree = new VFocus(tree);
    var result = isWithinNote(tree);
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
    var result = isWithinNote(tree);
    expect(result).to.be.true;
  });

});
