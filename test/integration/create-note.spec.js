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

describe('Creating Scribe Notes', function() {

  // Select & Note
  given('a selection', function() {
    givenContentOf('<p>On the 24th of |February, 1815, |the look-out at Notre-Dame de la Garde signalled the three-master, the Pharaon from Smyrna</p>', function() {
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

    when('we select a bit of text that spans several tags', function() {
      givenContentOf('<p>On the <b>24th of |February</b>The <b><i>look-out</i></b> at |Notre-Dame de la Garde signalled the three-master, the Pharaon from Smyrna</p>', function() {
        when('we press the noting key', function() {
          it('wraps the text in a note', function() {
            note().then(function() {
              scribeNode.getInnerHTML().then(function(innerHTML) {
                expect(innerHTML).to.include('February</gu-note></b>');
                expect(innerHTML).to.include('The </gu-note><b><i>');
                expect(innerHTML).to.include('look-out</gu-note></i></b>');
                expect(innerHTML).to.include(' at </gu-note>');

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

  });


  //see this issue for details of why this is here
  //https://github.com/guardian/flexible-content/issues/1396
  given('we already have a note', function() {

    var content = [
      '<gu-note class="note" data-note-id="1234">Start</gu-note>',
      '<gu-note class="note" data-note-id="1234">Middle</gu-note>',
      '<gu-note class="note" data-note-id="1234" id="end-note">End</gu-note>'
    ].join('');

    givenContentOf(content, function() {
      it('should retain the paragraph after the note has been clicked', function() {

        driver.executeScript(function() {
          document.getElementById('end-note').click();
        });

        scribeNode.getInnerHTML().then(function(innerHTML) {
          expect(innerHTML.match(/note--collapsed/g).length).to.equal(3);
        });

      });
    });
  });

  //see this issue for details of why this is here
  //https://github.com/guardian/flexible-content/issues/1397
  given('we already have a note', function() {
    givenContentOf('<p>|This is some content|</p><p>This is some more content</p>', function() {
      it('should retain the paragraph after the note has been clicked', function() {

        note().then(function() {
          scribeNode.getInnerHTML().then(function(innerHTML) {
            expect(innerHTML.match(/<p>/g).length).to.equal(2);
          });
        });

      });
    });
  });

  //see this issue for why this is here
  //https://github.com/guardian/scribe/issues/254
  given('we create a note', function() {
    givenContentOf('<gu-note><p>This is some <b>conte</b>nt</p><gu-note>|', function() {
      it('should not insert erroneous <br> tags', function() {

        scribeNode.sendKeys(webdriver.Key.BACK_SPACE)
          .then(function() {
            return scribeNode.sendKeys(webdriver.Key.BACK_SPACE);
          })
          .then(function() {
            return scribeNode.getInnerHTML();
          })
          .then(function(innerHTML) {
            expect(/<br>/g.test(innerHTML)).to.be.false;
          });

      });
    });
  });




  // Create & type
  given('a caret with no text selection', function() {
    when('we press the noting trigger key', function() {
      it('creates a note', function() {
        note().then(function() {
          scribeNode.getInnerHTML().then(function(innerHTML) {
            expect(innerHTML).to.include('</gu-note>');

            // Expect one start and one end attribute
            var numberOfNoteStartAttributes = innerHTML.match(/note--start/g).length;
            var numberOfNoteEndAttributes = innerHTML.match(/note--end/g).length;
            expect(numberOfNoteStartAttributes).to.equal(1);
            expect(numberOfNoteEndAttributes).to.equal(1);

            expect(innerHTML).to.include('data-note-edited-by');
            expect(innerHTML).to.include('data-note-edited-date');

            // Check that the caret has been placed inside the note.
            selectionIsInsideNote().then(function(result) {
              expect(result).to.be.true;
            });

          });
        });
      });
    });
  });
});
