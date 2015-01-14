var path = require('path');
var chai = require('chai');
var expect = chai.expect;
var h = require('virtual-hyperscript');

var VFocus = require(path.resolve(process.cwd(), 'src/vfocus'));
var isScribeMarker = require(path.resolve(process.cwd(), 'src/utils/noting/is-scribe-marker'));

var div;
var divFocus;
var scribeMarker;


beforeEach(function (){
  div = h('div');
  divFocus = new VFocus(div);
  scribeMarker = new VFocus(h('div.scribe-marker'));
})

describe('isScribeMarker()', function(){

  it('should correctly identify a scribe marker', function(){
    expect(isScribeMarker(scribeMarker)).to.be.true;
  });

  it('should correctly identify an element whichi is not a scribe marker', function(){
    expect(isScribeMarker(divFocus)).to.be.false;
  });

});
