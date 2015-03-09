var chai = require('chai');
var webdriver = require('selenium-webdriver');
var helpers = require('scribe-test-harness/helpers');
var note = require('./helpers/create-note');
var flag = require('./helpers/create-flag');

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

  //pressing delete when adjacent to a note should delete the last character of the note and
  //NOT the zero width space
  //see: https://github.com/guardian/scribe-plugin-noting/issues/103
  describe('Deleting the last character of a note', function(){

    given('we create a note', ()=>{
      givenContentOf('<p>|This is some content|</p>', ()=> {
        when('we try to delete the last character of the note', ()=>{
          it('should delete the character and not the zero width space', ()=>{

            note()
              .then(()=> scribeNode.sendKeys(webdriver.Key.BACK_SPACE))
              .then(()=> scribeNode.getInnerHTML())
              .then((html)=>{
                expect(html).to.include('conten</gu-note');
              });

          });
        });
      });
    });

  });


  describe('Deleting the last character of a flag', function(){

    given('we create a flag', ()=>{
      givenContentOf('<p>|This is some content|</p>', ()=> {
        when('we try to delete the last character of the flag', ()=>{
          it('should delete the character and not the zero width space', ()=>{

            flag()
              .then(()=> scribeNode.sendKeys(webdriver.Key.BACK_SPACE))
              .then(()=> scribeNode.getInnerHTML())
              .then((html)=>{
                expect(html).to.include('conten</gu-flag');
              });

          });
        });
      });
    });
  });


});
