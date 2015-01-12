var path = require('path');
var _ = require('lodash');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');
var VText = require('vtree/vtext');
var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));

var removeNote = require(path.resolve(process.cwd(), 'src/actions/noting/remove-note'));

describe('removeNote()', function() {

  it('should remove a note that surrounds the caret', function() {

    var tree = h('p', [
      h('gu-note', {dataset: {noteId: 1234}}, [
      new VText('this'),
      new VText('is'),
      h('em.scribe-marker'),
      new VText('some'),
      new VText('text')
    ])
    ]);

    tree = new VFocus(tree);
    tree = removeNote(tree);

    expect(/gu-note/g.test(JSON.stringify(tree))).to.be.false;
  });

});
