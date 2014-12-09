var path = require('path');
var expect = require('chai').expect;
var generateUUID = require(path.resolve(process.cwd(), 'src/utils/generate-uuid'));

describe('generateUUID()', function(){

  it('should return values which are completely unique', function(){
    var firstUUID = generateUUID();
    var seccondUUID = generateUUID();
    expect(firstUUID).not.to.equal(seccondUUID);
  });

});
