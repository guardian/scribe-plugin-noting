var path = require('path');
var chai = require('chai');
var expect = chai.expect;
var h = require('virtual-hyperscript');

var VText = require('vtree/vtext');
var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));
var isCaretNextToNote = require(path.resolve(process.cwd(), 'src/utils/noting/is-caret-next-to-note'));

var focus;
var beforeFocus;
var afterFocus;
beforeEach(()=>{

  afterFocus = h('p', [
    h('gu-note', [
      new VText('\u200B'),
      new VText('this'),
      new VText('is'),
      new VText('some'),
      new VText('content')
    ]),
    new VText('\u200B'),
    h('em.scribe-marker')
  ]);
  afterFocus = new VFocus(afterFocus);

  beforeFocus = h('p', [
    h('em.scribe-marker'),
    h('gu-note', [
      new VText('\u200B'),
      new VText('this'),
      new VText('is'),
      new VText('some'),
      new VText('content')
    ]),
    new VText('\u200B'),
  ]);
  beforeFocus = new VFocus(beforeFocus);

});

describe.only('isCaretNextToNote()', function(){

  it('should detect if the caret is next to a note', function(){

    expect(isCaretNextToNote(beforeFocus)).to.be.true;
    expect(isCaretNextToNote(afterFocus)).to.be.false;

  });

  it.only('should detect if the caret is after a note', function(){

    expect(isCaretNextToNote(afterFocus, 'prev')).to.be.true;
    expect(isCaretNextToNote(beforeFocus, 'prev')).to.be.false;

  })

});
