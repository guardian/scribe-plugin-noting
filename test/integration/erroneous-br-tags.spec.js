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

describe('Scribes fondness for erroneous <br> tags', ()=>{
  given('we have a note with at least two segments', ()=>{
    givenContentOf('<p>|This is a note <em>with</em> m|any segments</p>', ()=> {
      when('we delete content up to the end of a note segment', ()=>{
        it('should not produce an erroneous <br> tags', ()=>{
          note()
          .then(()=> scribeNode.sendKeys(webdriver.Key.BACK_SPACE))
          .then(()=> scribeNode.sendKeys(webdriver.Key.BACK_SPACE))
          //it takes a small amount of time for this bug to become visible
          //as such we wait here. 1000ms is a TOTAL magic number
          //but hey, it works.
          .then(()=> driver.sleep(1000))
          .then(()=> scribeNode.getInnerHTML())
          .then((innerHTML)=> {
            var result = (innerHTML.match(/<br>/g) || []);
            expect(result.length).to.equal(0);
          });

        });
      });
    });
  });
});
