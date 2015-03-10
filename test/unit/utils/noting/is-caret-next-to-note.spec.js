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

describe('isCaretNextToNote()', function(){

  it('should detect if the caret is next to a note', function(){

    expect(isCaretNextToNote(beforeFocus)).to.be.true;
    expect(isCaretNextToNote(afterFocus)).to.be.false;

  });

  it('should detect if the caret is after a note', function(){

    expect(isCaretNextToNote(afterFocus, 'prev', 'gu-flag')).to.be.false;
    expect(isCaretNextToNote(afterFocus, 'prev')).to.be.true;
    expect(isCaretNextToNote(beforeFocus, 'prev')).to.be.false;

  });

  it('should return false if the caret is next to a flag', function(){
    var focus = h('p', [
      h('em.scribe-marker'),
      h('gu-flag', [
        new VText('some'),
        new VText('content')
      ])
    ]);

    focus = new VFocus(focus);
    expect(isCaretNextToNote(focus)).to.be.false;
    expect(isCaretNextToNote(focus, 'next', 'gu-flag')).to.be.true;
  });

  it('should return false if the caret is in a different paragraph', function(){
    var focus = h('div', [
      h('p', [
        h('gu-note', [
          new VText('This'),
          new VText('is')
        ])
      ]),
      h('p', [
        h('em.scribe-marker')
      ])
    ]);
    focus = new VFocus(focus);
    expect(isCaretNextToNote(focus, 'prev')).to.be.false;
  });

});
