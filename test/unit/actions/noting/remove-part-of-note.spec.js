
var util = require('util');
var path = require('path');
var _ = require('lodash');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');
var VText = require('vtree/vtext');
var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));

var removePartOfNote = require(path.resolve(process.cwd(), 'src/actions/noting/remove-part-of-note'));

describe('removePartNote()', function() {

  it('should remove a note segment that is selected', function() {

    var tree = h('p', [
      h('gu-note', {dataset: {noteId: 1234}}, [
      new VText('this'),
      new VText('is'),
      h('em.scribe-marker'),
      new VText('some'),
      h('em.scribe-marker'),
      new VText('text')
    ])
    ]);

    tree = new VFocus(tree);
    tree = removePartOfNote(tree);

    expect(JSON.stringify(tree).match(/gu-note/g).length).to.be.equal(3);

  });

});
