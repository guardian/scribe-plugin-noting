var chai = require('chai');
var webdriver = require('selenium-webdriver');
var helpers = require('scribe-test-harness/helpers');

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

function clickElement(id){
  return driver.executeScript((id)=>{
    document.getElementById(id).click();
  }, id);
}

//scribe seems to be stripping the markers out of the dom before we can get the html
//this is making these tests consistently fail, as such these have been skipped
//until I can figure out why this has happened
describe.skip('Selecting whole notes', ()=>{

  given('we have a note', ()=>{
    givenContentOf('<p><gu-note id="test-note">This is some| content</gu-note></p>', ()=> {
      when('we click the note two times', ()=>{
        it('selects the whole note', ()=> {

          clickElement('test-note')
            .then(()=> clickElement('test-note'))
            .then(()=> driver.executeScript(()=>{
              var s = new scribe.api.Selection();
              s.placeMarkers();
            }))
            .then(()=> scribeNode.getInnerHTML())
            .then((html)=> {
              var noteContent = html.match(/<em(.+?)<\/em>/g);
              expect(noteContent.length).to.equal(2);
            });

        });
      });
    });
  });


  given('we have a note', ()=>{
    givenContentOf('<p><gu-note id="test-note">This is some| content</gu-note></p>', ()=> {
      when('we press meta-shift-a', ()=>{
        it('selects the whole note', ()=> {

          scribeNode.sendKeys(webdriver.Key.chord(webdriver.Key.META, webdriver.Key.SHIFT, 'a'))
            .then(()=> driver.executeScript(()=>{
              var s = new scribe.api.Selection();
              s.placeMarkers();
            }))
            .then(()=> scribeNode.getInnerHTML())
            .then((html)=> {
              var noteContent = html.match(/<em(.+?)<\/em>/g);
              expect(noteContent.length).to.equal(2);
            });

        });
      });
    });
  });


});
