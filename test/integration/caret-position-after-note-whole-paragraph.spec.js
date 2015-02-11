var chai = require('chai'); var webdriver = require('selenium-webdriver');
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
  describe('Caret position after creating a note', function(){

    given('we have a selection', ()=>{
      givenContentOf('<p>|This is some |content</p>', ()=> {
        when('we create a note', ()=>{
          it('should place the caret after the note', ()=> {

            note()
            .then(()=> driver.executeScript(function(){
              var s = new scribe.api.Selection();
              s.placeMarkers();
            }))
            .then(()=> scribeNode.getInnerHTML())
            .then((html)=> {
              expect(html).to.include('some </gu-note>\u200B<em')
            });

          });
        });
      });
    });
  });


  describe('Note barrier placement', function(){
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

    //when we have a note that spans to the end of a paragraph
    //when we add a note previously within that paragraph the caret should be placed
    //at the end of the NEW paragraph not the end of the paragraph
    //see: https://github.com/guardian/scribe-plugin-noting/issues/91
    given('we have a note that spans to the end of a paragraph', ()=>{
      givenContentOf('<p>|This| is some <gu-note>content</gu-note></p>', ()=> {
        when('we create a note and the add a return', ()=>{
          it('should not add a zero width space to an adjacent text node which starts with a url', ()=> {

            note()
            .then(()=> driver.executeScript(function(){
              var s = new scribe.api.Selection();
              s.placeMarkers();
            }))
            .then(()=> scribeNode.getInnerHTML())
            .then((html)=> {
              expect(html).not.to.include('</em><gu-note>content');
              expect(html).to.include('This</gu-note>');
            });

          });
        });
      });
    });

    given('we have a selection', ()=>{
      givenContentOf('<p>|This is some |content</p>', ()=> {
        when('we create a flag', ()=>{
          it('should place the caret after the flag', ()=> {

            flag()
            .then(()=> driver.executeScript(function(){
              var s = new scribe.api.Selection();
              s.placeMarkers();
            }))
            .then(()=> scribeNode.getInnerHTML())
            .then((html)=> {
              //FF doesn't place the zero width space properly before the note.
              //This test consistently passed in chrome but consistently fails in FF so has been commented
              //expect(html).to.include('class="note note--start note--end">\u200BThis is')
              expect(html).to.include('some </gu-flag>\u200B<em')
            });

          });
        });
      });
    });
  });

});
