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
var note = require('./helpers/create-note');

var selectionIsInsideNote = require('./helpers/selection-within-note');

describe('Creating Notes Within a Flag', function() {

  // Create a note within a flag at the caret
  given('The caret within a flag', function() {
    givenContentOf('<p><gu-flag>On the 24th of | February, 1815, the look-out at Notre-Dame<gu-flag></p>', function() {
      when('pressing the noting key', function() {
        it('does not create a note', function() {

          note().then(function() {
            scribeNode.getInnerHTML().then(function(innerHTML) {
              expect(innerHTML).to.not.include('</gu-note>');
            });
          });

        });
      });
    });
  });

  // Create a note within a flag from selection
  given('A selection within a flag', function() {
    givenContentOf('<p><gu-flag>On the 24th of | February, 1815, the |look-out at Notre-Dame<gu-flag></p>', function() {
      when('pressing the noting key', function() {
        it('does not create a note', function() {

          note().then(function() {
            scribeNode.getInnerHTML().then(function(innerHTML) {
              expect(innerHTML).to.not.include('</gu-note>');
            });
          });

        });
      });
    });
  });

  given('A selection spanning a flag on the left hand side', function() {
    givenContentOf('<p>On the 24th of | February, 1815, <gu-flag>the |look-out at Notre-Dame<gu-flag></p>', function() {
      when('pressing the noting key', function() {
        it('does not create a note', function() {

          note().then(function() {
            scribeNode.getInnerHTML().then(function(innerHTML) {
              expect(innerHTML).to.not.include('</gu-note>');
            });
          });

        });
      });
    });
  });

  given('A selection spanning a flag on the right hand side', function() {
    givenContentOf('<p><gu-flag>On the 24th of | February, 1815, the look-out at N<gu-flag>otre-D|ame</p>', function() {
      when('pressing the noting key', function() {
        it('does not create a note', function() {

          note().then(function() {
            scribeNode.getInnerHTML().then(function(innerHTML) {
              expect(innerHTML).to.not.include('</gu-note>');
            });
          });

        });
      });
    });
  });

  given('A selection spanning a flag on the right hand side', function() {
    givenContentOf('<p>|On the 24th of <gu-flag>February, 1815, the</gu-flag> look-out at Notre-Dame|</p>', function() {
      when('pressing the noting key', function() {
        it('does not create a note', function() {

          note().then(function() {
            scribeNode.getInnerHTML().then(function(innerHTML) {
              expect(innerHTML).to.not.include('</gu-note>');
            });
          });

        });
      });
    });
  });

});
