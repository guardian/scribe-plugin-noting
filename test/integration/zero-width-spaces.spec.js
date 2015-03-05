var chai = require('chai');
var webdriver = require('selenium-webdriver');
var helpers = require('scribe-test-harness/helpers');
var note = require('./helpers/create-note');

var expect = chai.expect;

var when = helpers.when;
var given = helpers.given;
var givenContentOf = helpers.givenContentOf;

var scribeNode;
var driver;
beforeEach(()=> {
  scribeNode = helpers.scribeNode;
  driver = helpers.driver;
});

describe('Zero width spaces', ()=>{

  describe.only('Deleting the last character of a note', function(){

    given('we create a note', ()=>{
      givenContentOf('<p>|This is some content|</p>', ()=> {
        when('we try to delete the last character of the note', ()=>{
          it('should delete the character and not the zero width space', ()=>{

            note()
              .then(()=> scribeNode.sendKeys(webdriver.Key.BACK_SPACE))
              .then(()=> scribeNode.getInnerHTML())
              .then((html)=>{
                console.log('-----------------------');
                console.log(html);
                console.log('-----------------------');
                expect(html).to.include('conten</gu-note');
              });

          });
        });
      });
    });

  });

});
