var path = require('path');
var chai = require('chai');
var expect = chai.expect;
var h = require('virtual-hyperscript');

var VText = require('vtree/vtext');
var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));
var removeCharacterFromAdjacentNote = require(path.resolve(process.cwd(), 'src/actions/noting/remove-character-from-adjacent-note'));

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

describe('removeCharacterFromAdjacentNote()', function(){

  it('should remove a character from an adjacent note', function(){

    removeCharacterFromAdjacentNote(beforeFocus)
    var note = beforeFocus.next().next();
    var lastTextNode = note.getChildAt(1);
    expect(lastTextNode.text).to.equal('his');

  });

});
