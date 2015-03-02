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

describe('Ensure note integrity', ()=>{
  given('we have a note that contain no zero-width-spaces', ()=>{
    givenContentOf('<p><gu-note>This is some content</gu-note>|</p>', ()=> {
      when('add some test to the document', ()=>{
        it('should add zero width spaces to the note', ()=>{

          scribeNode.sendKeys('more content')
            .then(()=> driver.sleep(1000))
            .then(()=> scribeNode.getInnerHTML())
            .then((html)=>{
              expect(html.match(/\u200BThis/).length).to.equal(1);
            });

        });
      });
    });
  });
});
