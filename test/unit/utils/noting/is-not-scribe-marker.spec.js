var path = require('path');
var chai = require('chai');
var expect = chai.expect;
var h = require('virtual-hyperscript');

var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));
var isNotScribeMarker = require(path.resolve(process.cwd(), 'src/utils/noting/is-not-scribe-marker'));

var div;
var divFocus;
var scribeMarker;


beforeEach(function (){
  div = h('div');
  divFocus = new VFocus(div);
  scribeMarker = new VFocus(h('div.scribe-marker'));
})

describe('isNotScribeMarker()', function(){

  it('should correctly identify a scribe marker', function(){
    expect(isNotScribeMarker(scribeMarker)).to.be.false;
  });

  it('should correctly identify an element which is not a scribe marker', function(){
    expect(isNotScribeMarker(divFocus)).to.be.true;
  });

});
