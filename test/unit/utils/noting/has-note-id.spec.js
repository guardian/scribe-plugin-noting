var path = require('path');
var chai = require('chai');
var expect = chai.expect;

var h = require('virtual-hyperscript');
var virtualize = require('vdom-virtualize');

var VALUE = 1;

var hasNoteId = require(path.resolve(process.cwd(), 'src/utils/noting/has-note-id'));
var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));

describe('hasNoteId()', function() {


  it('should identify a vNode without a note id', function() {

    var div = h('div');
    div.properties = {
      dataset: {}
    };

    expect(hasNoteId(div, VALUE)).to.be.false;
  });


  it('should identify a vNode with a note id', function() {

    var div = h('div');
    div.properties = {
      dataset: {}
    };

    div.properties.dataset['noteId'] = VALUE;
    expect(hasNoteId(div, VALUE)).to.be.true;

  });

});
