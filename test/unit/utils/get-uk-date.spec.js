var path = require('path');
var expect = require('chai').expect;
var getUKDate = require(path.resolve(process.cwd(), 'src/utils/get-uk-date'));

describe('getUKDate()', function(){
  it('should return a correctly formatted uk date', function(){
    var date = getUKDate();
    var regex = /unknown (\d{1,2})[-/.](\d{1,2})[-/.](\d{4}) at (\d{2})[:](\d{2})/g;
    expect(regex.test(date)).to.be.true;
  });

});
