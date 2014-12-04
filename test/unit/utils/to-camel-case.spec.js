var path = require('path');
var expect = require('chai').expect;
var toCamelCase = require(path.resolve(process.cwd(), 'src/utils/to-camel-case'));

describe('toCamelCase()', function(){
  it('should return a correctly camel-cased string', function(){

    expect(toCamelCase('to-camel-case')).to.equal('toCamelCase');

  })
})
