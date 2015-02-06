var chai = require('chai');
var webdriver = require('selenium-webdriver');
var helpers = require('scribe-test-harness/helpers');

var expect = chai.expect;

var when = helpers.when;
var given = helpers.given;
var givenContentOf = helpers.givenContentOf;

var scribeNode;
var driver;
beforeEach(function() {
  scribeNode = helpers.scribeNode;
  driver = helpers.driver;
});

describe('Toggle Scribe Notes', function(){

  //checks note toggle function on all notes see:
  //https://github.com/guardian/scribe-plugin-noting/issues/51
  given('we have two notes in different collapsed states', function(){
    givenContentOf('<p>On the 24th of February, <gu-note class="note note--collapsed">1815, the</gu-note> look-out at <gu-note class="note">Notre-Dame de</gu-note> la Garde signalled the three-master, the Pharaon from Smyrna</p>', function() {
      it('should toggle both notes into the correct state', function (){

        driver.executeScript(function(){
          scribe.commands.correctCollapseToggleAll.execute();
        })
        .then(function(){
          return scribeNode.getInnerHTML();
        })
        .then(function(innerHTML){
          expect(innerHTML.match(/note--collapsed/g).length).to.equal(2);
        });
      });
    });
  });


  given('we have on expanded note', function(){
    givenContentOf('<p>On the 24th of February, <gu-note class="note note--start note--end">1815, the</gu-note> look-out at Notre-Dame de la Garde signalled the three-master, the Pharaon from Smyrna</p>', function() {
      it('should toggle both notes into the correct state', function (){

        driver.executeScript(function(){
          scribe.commands.correctCollapseToggleAll.execute();
        })
        .then(function(){
          return scribeNode.getInnerHTML();
        })
        .then(function(innerHTML){
          expect(innerHTML.match(/note--collapsed/g).length).to.equal(1);
        });
      });
    });
  });
});
