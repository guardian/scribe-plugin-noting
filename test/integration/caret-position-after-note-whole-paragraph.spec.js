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


var note = require('./helpers/create-note');

//when noting the contents of a paragraph a zero width space is added to the NEXT element
//this space should be added after the note but before the end of the paragraph
//see: https://github.com/guardian/scribe-plugin-noting/issues/85
describe('Caret position after noting a paragraph', ()=>{

  given('we have a selection within a note', ()=>{
    givenContentOf('<p>|This is some content|</p><p>This is some more content</p>', ()=> {
      when('we create a note and then add some text', ()=>{
        it('should place the caret outside of the collapsed note', ()=> {

          note()
          .then(()=> scribeNode.sendKeys('test'))
          .then(()=> scribeNode.getInnerHTML())
          .then((html)=> {
            expect(html).not.to.include('<p>\u200Btest');
            expect(html).not.to.include('<p>\u200BThis');
          })
          .then(()=> {
            return driver.executeScript(function(){
              var s = new scribe.api.Selection();
              s.placeMarkers();
            });
          })
          .then(()=> scribeNode.getInnerHTML())
          .then((html)=> {
            expect(html).to.include('</em></p>');
          });

        });
      });
    });
  });

  //when a note is created at the end of a paragraph and the next paragraph ONLY contains a link
  //composer can't call up an embed as a zero width space is added to the beginning
  //see: https://github.com/guardian/scribe-plugin-noting/issues/86
 given('we have a selection within a note', ()=>{
    givenContentOf('<p>|This is some content|</p><p>https://github.com/guardian/scribe-plugin-noting/issues/86</p>', ()=> {
      when('we create a note and the add a return', ()=>{
        it('should not add a zero width space to an adjacent text node which starts with a url', ()=> {

          note()
          .then(()=> scribeNode.sendKeys(webdriver.Key.ENTER))
          .then(()=> scribeNode.getInnerHTML())
          .then((html)=> {
            expect(html).not.to.include('<p>\u200BThis');
          });

        });
      });
    });
  });


});
