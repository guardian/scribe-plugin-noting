var path = require('path');
var _ = require('lodash');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');
var VText = require('vtree/vtext');
var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));

var createNoteFromSelection = require(path.resolve(process.cwd(), 'src/actions/noting/create-note-at-caret'));

describe('createNoteFromSelection()', function() {

  it.skip('should create a note containing the current selection', function() {

    var tree = h('p', [
      new VText('This'),
      h('em-scribe-marker'),
      new VText('is'),
      new VText('some'),
      h('em-scribe-marker'),
      new VText('text')
    ])
    tree = new VFocus(tree);

    createNoteFromSelection(tree);

    console.log('-----------------------');
    console.log(tree);
    console.log('-----------------------');

  });
});
