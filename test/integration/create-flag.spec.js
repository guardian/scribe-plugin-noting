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

var note = require('./helpers/create-note');

var selectionIsInsideNote = require('./helpers/selection-within-note');

describe('Creating Scribe Flags', function() {

  // Select & Note
  given('a selection', function() {
    givenContentOf('<p>On the 24th of |February, 1815, |the look-out at Notre-Dame de la Garde signalled the three-master, the Pharaon from Smyrna</p>', function() {
      when('pressing the noting key', function() {

        it.skip('wraps the text in a note', function() {
          note().then(function() {
            scribeNode.getInnerHTML().then(function(innerHTML) {

              expect(innerHTML).to.include('February, 1815, </gu-flag>');

              // Expect one start and one end attribute
              var numberOfNoteStartAttributes = innerHTML.match(/note--start/g).length;
              var numberOfNoteEndAttributes = innerHTML.match(/note--end/g).length;
              var numberOfNoteUndefinedElements = innerHTML.match(/undefined/g);

              expect(numberOfNoteStartAttributes).to.equal(1);
              expect(numberOfNoteEndAttributes).to.equal(1);
              expect(numberOfNoteUndefinedElements).to.be.a('null');

              expect(innerHTML).to.include('data-note-edited-by');
              expect(innerHTML).to.include('data-note-edited-date');

              selectionIsInsideNote().then(function(result) {
                expect(result).to.be.false;
              });

            });
          });
        });
      });
    });
  });
});
