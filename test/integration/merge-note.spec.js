var chai = require('chai');
var webdriver = require('selenium-webdriver');
var helpers = require('scribe-test-harness/helpers');
var _ = require('lodash');

var expect = chai.expect;

var when = helpers.when;
var given = helpers.given;
var givenContentOf = helpers.givenContentOf;

var scribeNode;
beforeEach(function() {
  scribeNode = helpers.scribeNode;
});

var note = require('./helpers/create-note');
var selectionIsInsideNote = require('./helpers/selection-within-note');

describe('Merging Scribe Notes', function() {

  given('a selection', function() {

    //Create Contiguous Note
    when('the selection is adjacent to a note', function() {
      givenContentOf('<p>On the 24th of |February, 1815, |<gu-note class="note">the look-out at Notre-Dame de la Garde signalled the three-master, the Pharaon from Smyrna</gu-note></p>', function() {
        when('pressing the noting key', function() {

          it('wraps the text in a note', function() {
            note().then(function() {
              scribeNode.getInnerHTML().then(function(innerHTML) {

                expect(innerHTML).to.include('February, 1815, </gu-note>');

                // Expect one start and one end attribute
                var numberOfNoteStartAttributes = innerHTML.match(/note--start/g).length;
                var numberOfNoteEndAttributes = innerHTML.match(/note--end/g).length;
                expect(numberOfNoteStartAttributes).to.equal(1);
                expect(numberOfNoteEndAttributes).to.equal(1);

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

    // Merges automatically when text between two notes is removed
    when('the selection is adjacent to a note', function() {
      givenContentOf('<p>dfgdfgdfg <gu-note class="note">On the 24th of February, 1815, the look-out</gu-note>| at Notre-Dame de |<gu-note class="note">la Garde signalled the three-master, the Pharaon from Smyrna</gu-note> dfgdfgdfg </p>', function() {
        when('pressing the noting key', function() {

          it('wraps the text in a note', function() {
            scribeNode.sendKeys(webdriver.Key.DELETE);
              scribeNode.getInnerHTML().then(function(innerHTML) {
                var hasSameIds = _.uniq(innerHTML.match(/data-note-id="(.*?)"/g)).length === 1;
                expect(hasSameIds).to.be.true;
              });
          });

        });
      });
    });

    // Extend a Note
    when('the selection starts outside of a note and finished within a note', function() {
      givenContentOf('<p>On the 24th of |February, 1815, <gu-note class="note">the look-out at Notre-Dame| de la Garde signalled the three-master, the Pharaon from Smyrna</gu-note></p>', function() {
        when('pressing the noting key', function() {

          it('wraps the text in a single note', function() {
            note().then(function() {
              scribeNode.getInnerHTML().then(function(innerHTML) {

                expect(innerHTML).to.include('February, 1815, </gu-note>');

                // Expect one start and one end attribute
                var numberOfNoteStartAttributes = innerHTML.match(/note--start/g).length;
                var numberOfNoteEndAttributes = innerHTML.match(/note--end/g).length;
                expect(numberOfNoteStartAttributes).to.equal(1);
                expect(numberOfNoteEndAttributes).to.equal(1);

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

    // Merging a Note
    when('the start of our selection is within a note and the end is within another note', function() {
      givenContentOf('<p><gu-note class="note">On the |24th of</gu-note> February, the look-out at <gu-note class="note">Notre-Dame de| la Garde</gu-note> signalled the three-master, the Pharaon from Smyrna</p>', function() {
        when('we press the noting key', function() {

          it('merges the two notes together with the text inbetween', function() {
            note().then(function() {
              scribeNode.getInnerHTML().then(function(innerHTML) {
                expect(innerHTML).to.include('the 24th of</gu-note>');
                expect(innerHTML).to.include('look-out at </gu-note>');
                expect(innerHTML).to.include('Notre-Dame de la Garde</gu-note>');

                // Expect one start and one end attribute
                var numberOfNoteStartAttributes = innerHTML.match(/note--start/g).length;
                var numberOfNoteEndAttributes = innerHTML.match(/note--end/g).length;
                expect(numberOfNoteStartAttributes).to.equal(1);
                expect(numberOfNoteEndAttributes).to.equal(1);

                expect(innerHTML).to.include('data-note-edited-by');
                expect(innerHTML).to.include('data-note-edited-date');
              });
            });
          });

        });
      });
    });

  });

});
