var util = require('util');
var path = require('path');
var _ = require('lodash');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');
var VText = require('vtree/vtext');
var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));

var createNoteFromSelection = require(path.resolve(process.cwd(), 'src/actions/noting/create-note-from-selection'));

describe('createNoteFromSelection()', ()=> {

  it('should create a note wrapping the selected text', ()=> {

    var tree = h('p', [
      h('em.scribe-marker'),
      new VText('This is some text'),
      h('em.scribe-marker')
    ]);

    tree = new VFocus(tree);
    tree = createNoteFromSelection(tree);

    expect(tree.next().vNode.tagName).to.equal('gu-note');

  });

  it('should create a note wrapping ONLY the selected text', ()=> {

    var tree = h('div', [
      h('p', 'This is some text'),
      h('em.scribe-marker'),
      h('p', 'This is some text'),
      h('em.scribe-marker'),
      h('p', 'This is some text'),
    ]);

    tree = new VFocus(tree);
    tree = createNoteFromSelection(tree);

    expect(tree.next().vNode.tagName).not.to.equal('gu-note');
    expect(tree.next().next().vNode.tagName).not.to.equal('gu-note');

  });



});
