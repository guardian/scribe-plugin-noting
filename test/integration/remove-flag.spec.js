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

var flag = require('./helpers/create-flag');

describe('Removing a Scribe flag', function() {

  // Caret remove
  given('the caret is within a flag', function() {
    when('we are inside a flag and haven\'t selected anything', function() {
      givenContentOf('<p>On the 24th of <gu-flag class="note">Febr|uary, 1815, </gu-flag>the look-out at Notre-Dame de la Garde signalled the three-master, the Pharaon from Smyrna</p>', function() {
        when('we press the noting key', function() {
          it('the flag is unnoted', function() {
            flag().then(function() {
              scribeNode.getInnerHTML().then(function(innerHTML) {
                expect(innerHTML).to.not.include('</gu-flag>');
                expect(innerHTML).to.include('February, 1815, ');
              });
            });
          });
        });
      });
    });
  });

  //Remove part of a note
  when('we select some text within a note', function() {
    givenContentOf('<p>On the 24th of <gu-flag class="note">Febr|uary|, 1815, </gu-flag>the look-out at Notre-Dame de la Garde signalled the three-master, the Pharaon from Smyrna</p>', function() {
      when('we press the flag key', function() {
        it('the selected part within the note is unnoted', function() {
          flag().then(function() {
            scribeNode.getInnerHTML().then(function(innerHTML) {
              // Expect two notes with note--start and note--end classes.
              var numberOfNoteStartAttributes = innerHTML.match(/note--start/g).length;
              var numberOfNoteEndAttributes = innerHTML.match(/note--end/g).length;
              var numberOfFlags = innerHTML.match(/gu-flag/g).length

              expect(numberOfNoteStartAttributes).to.equal(2);
              expect(numberOfNoteEndAttributes).to.equal(2);
              expect(numberOfFlags).to.equal(4);
            });
          });
        });
      });
    });
  });



});
