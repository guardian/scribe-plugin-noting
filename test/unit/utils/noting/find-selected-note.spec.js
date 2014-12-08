var path = require('path');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');
var VText = require('vtree/vtext');

var findSelectedNote = require(path.resolve(process.cwd(), 'src/utils/noting/find-selected-note'));
var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));

describe('findSelectedNote()', function() {

  it('should return undefined if no note is selected', function() {

    var div = h('div');
    var note = h('gu-note', [div]);
    var focus = new VFocus(note);

    expect(findSelectedNote(focus)).to.be.an('undefined');

  });

  it('should return only the selected note', function() {
    var tree = h('div', [
      h('gu-note'),
      h('gu-note', [
        h('em.scribe-marker'),
        new VText('This is some text'),
        h('em.scribe-marker')
      ]),
      h('gu-note')
    ]);

    tree = new VFocus(tree);
    var result = findSelectedNote(tree);

    expect(result[0].vNode.tagName).to.equal('gu-note');
    expect(result[1].vNode.tagName).to.equal('gu-note');
    expect(result[2].vNode.tagName).to.equal('gu-note');

    expect(result[1].vNode.children.length).to.equal(3);

  });

});
