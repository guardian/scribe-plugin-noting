var path = require('path');
var _ = require('lodash');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');
var VText = require('vtree/vtext');
var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));

var resetNoteBarriers = require(path.resolve(process.cwd(), 'src/actions/noting/reset-note-barriers'));

describe('resetNoteBarriers()', function() {

  it('should add barriers to a selected note', function(){
    var tree = h('p', [
      h('gu-note', [
        new VText('This'),
        new VText('is'),
        new VText('some')
      ]),
      new VText('text')
    ]);
    tree = new VFocus(tree);

    var result = resetNoteBarriers(tree);

    //the first child of a note should be a note barrier
    expect(tree.next().next().vNode.text.match(/\u200B/g).length).to.equal(1);

    //the first child AFTER the note should be a barrier
    expect(tree.vNode.children[1].text.match(/\u200B/g).length).to.equal(1);

  });

});
