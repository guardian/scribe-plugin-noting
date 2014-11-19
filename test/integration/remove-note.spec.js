var chai = require('chai');
var webdriver = require('selenium-webdriver');
var helpers = require('scribe-test-harness/helpers');

var expect = chai.expect;

var when = helpers.when;
var given = helpers.given;
var givenContentOf = helpers.givenContentOf;

var scribeNode;
beforeEach(function() {
  scribeNode = helpers.scribeNode;
});

var note = require('./helpers/create-note');

describe('Removing a Scribe Note', function(){

  // Caret remove
  given('the caret is within a note', function() {
    when('we are inside a note and haven\'t selected anything', function() {
      givenContentOf('<p>On the 24th of <gu-note class="note">Febr|uary, 1815, </gu-note>the look-out at Notre-Dame de la Garde signalled the three-master, the Pharaon from Smyrna</p>', function() {
        when('we press the noting key', function() {
          it('the note is unnoted', function() {
            note().then(function() {
              scribeNode.getInnerHTML().then(function(innerHTML) {
                expect(innerHTML).to.not.include('</gu-note>');
                expect(innerHTML).to.include('February, 1815, ');
              });
            });
          });
        });
      });
    });
  });


  given('a selection', function(){

    // Remove note
    when('we select the contents of a note', function() {
      givenContentOf('<p>On the 24th of <gu-note class="note">|February, 1815, |</gu-note>the look-out at Notre-Dame de la Garde signalled the three-master, the Pharaon from Smyrna</p>', function() {
        when('we press the noting key', function() {
          it('unnotes the note', function () {
            note().then(function () {
              scribeNode.getInnerHTML().then(function (innerHTML) {
                expect(innerHTML).to.not.include('</gu-note>');
              });
            });
          });
        });
      });
    });

    when('we select the contents of a note except for a space', function() {
      givenContentOf('<p>On the 24th of <gu-note class="note"> |February, 1815, |</gu-note>the look-out at Notre-Dame de la Garde signalled the three-master, the Pharaon from Smyrna</p>', function() {
        when('we press the noting key', function() {
          it('unnotes the note', function () {
            note().then(function () {
              scribeNode.getInnerHTML().then(function (innerHTML) {
                expect(innerHTML).to.not.include('</gu-note>');
              });
            });
          });
        });
      });
    });

    // Remove Part of a Note
    when('we select some text within a note', function() {
      givenContentOf('<p>On the 24th of <gu-note class="note">Febr|uary|, 1815, </gu-note>the look-out at Notre-Dame de la Garde signalled the three-master, the Pharaon from Smyrna</p>', function() {
        when('we press the noting key', function() {
          it('the selected part within the note is unnoted', function() {
            note().then(function() {
              scribeNode.getInnerHTML().then(function(innerHTML) {
                // Expect two notes with note--start and note--end classes.
                var numberOfNoteStartAttributes = innerHTML.match(/note--start/g).length;
                var numberOfNoteEndAttributes = innerHTML.match(/note--end/g).length;
                expect(numberOfNoteStartAttributes).to.equal(2);
                expect(numberOfNoteEndAttributes).to.equal(2);
              });
            });
          });
        });
      });
    });

    when('we select some text at the end of a note', function() {
      givenContentOf('<p>On the 24th of <gu-note class="note">February|, 1815, |</gu-note>the look-out at Notre-Dame de la Garde signalled the three-master, the Pharaon from Smyrna</p>', function() {
        when('we press the noting key', function() {
          it('the selected part within the note is unnoted', function() {
            note().then(function() {
              scribeNode.getInnerHTML().then(function(innerHTML) {
                // Expect two notes with note--start and note--end classes.
                var numberOfNoteStartAttributes = innerHTML.match(/note--start/g).length;
                var numberOfNoteEndAttributes = innerHTML.match(/note--end/g).length;
                expect(numberOfNoteStartAttributes).to.equal(1);
                expect(numberOfNoteEndAttributes).to.equal(1);
              });
            });
          });
        });
      });
    });

    when('we select some text at the start of a note', function() {
      givenContentOf('<p>On the 24th of <gu-note class="note">|February|, 1815, </gu-note>the look-out at Notre-Dame de la Garde signalled the three-master, the Pharaon from Smyrna</p>', function() {
        when('we press the noting key', function() {
          it('the selected part within the note is unnoted', function() {
            note().then(function() {
              scribeNode.getInnerHTML().then(function(innerHTML) {
                // Expect two notes with note--start and note--end classes.
                var numberOfNoteStartAttributes = innerHTML.match(/note--start/g).length;
                var numberOfNoteEndAttributes = innerHTML.match(/note--end/g).length;
                expect(numberOfNoteStartAttributes).to.equal(1);
                expect(numberOfNoteEndAttributes).to.equal(1);
              });
            });
          });
        });
      });
    });

  });

  given('the caret is within a note', function() {
    when('we are inside a note and haven\'t selected anything', function() {
      givenContentOf('<p>On the 24th of <gu-note class="note">Febr|uary, 1815, </gu-note>the look-out at Notre-Dame de la Garde signalled the three-master, the Pharaon from Smyrna</p>', function() {
        when('we press the noting key', function() {
          it('the note is unnoted', function() {
            scribeNode.sendKeys(webdriver.Key.chord(webdriver.Key.CONTROL, 'b'))
            note().then(function() {
              scribeNode.getInnerHTML().then(function(innerHTML) {
                expect(innerHTML).to.not.include('</gu-note>');
                expect(innerHTML).to.include('February, 1815, ');
              });
            });

          });
        });
      });
    });
  });


});
