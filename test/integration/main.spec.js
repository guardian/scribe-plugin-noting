var chai = require('chai');
var webdriver = require('selenium-webdriver');
var expect = chai.expect;

var helpers = require('scribe-test-harness/helpers');
helpers.registerChai(chai);
var when = helpers.when;
var given = helpers.given;
var initializeScribe = helpers.initializeScribe.bind(null, '../../bower_components/scribe/src/scribe');
var seleniumBugs = helpers.seleniumBugs;
var givenContentOf = helpers.givenContentOf;
var givenContentAsHTMLOf = helpers.givenContentAsHTMLOf;
var browserName = helpers.browserName;

function loadPlugin() {
  return driver.executeAsyncScript(function (done) {
    require(['../../build/scribe-plugin-noting.js'], function (scribePluginNoting) {
      window.scribe.use(scribePluginNoting("A User"));
      done();
    });
  });
}

// Press the noting key. Returns promise.
function note() {
  return scribeNode.sendKeys(webdriver.Key.F10);
}


/**
 *  Helpers
 */

function selectionIsInsideNote() {
  return driver.executeScript(function () {
    function domWalkUpCheck(node, predicate) {
     if (!node.parentNode) { return false; }

     return predicate(node) ? true : domWalkUpCheck(node.parentNode, predicate);
    }

    // Checks whether our selection is within another note.
    function insideNote() {
     var node = window.getSelection().getRangeAt(0).startContainer;

     return domWalkUpCheck(node, function(node) {
       return node.tagName === 'GU-NOTE';
     });
    }

    return insideNote();
  });
}






// Get new references each time a new instance is created
var driver;
before(function () {
  driver = helpers.driver;
});

var scribeNode;
beforeEach(function () {
  scribeNode = helpers.scribeNode;
});

describe('noting plugin', function () {
  given('we are in a text area', function () {
    beforeEach(function () {
      return initializeScribe();
    });

    beforeEach(loadPlugin);

    when('when we haven\'t pressed any key', function () {
      it('won\'t have any note', function () {
        scribeNode.getInnerHTML().then(function (innerHTML) {
          expect(innerHTML).to.not.include('</gu-note>');
        });
      });
    });

    /**
    * Feature: Add note
    */

    when('we press the noting key', function () {
      it('creates a note', function () {
        note().then(function () {
          scribeNode.getInnerHTML().then(function (innerHTML) {
            expect(innerHTML).to.include('</gu-note>');

            // Expect one start and one end attribute
            var numberOfNoteStartAttributes = innerHTML.match(/note--start/g).length;
            var numberOfNoteEndAttributes = innerHTML.match(/note--end/g).length;
            expect(numberOfNoteStartAttributes).to.equal(1);
            expect(numberOfNoteEndAttributes).to.equal(1);

            // Expect one start and one end note barrier
            var numberOfNoteStartAttributes = innerHTML.match(/note-barrier--start/g).length;
            var numberOfNoteEndAttributes = innerHTML.match(/note-barrier--end/g).length;
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

    when('we select a bit of text within a paragraph', function() {
      givenContentOf('<p>On the 24th of |February, 1815, |the look-out at Notre-Dame de la Garde signalled the three-master, the Pharaon from Smyrna</p>', function() {
        when('we press the noting key', function() {
          it('wraps the text in a note', function () {
            note().then(function () {
              scribeNode.getInnerHTML().then(function (innerHTML) {
                expect(innerHTML).to.include('February, 1815, </gu-note>');

                // Expect one start and one end attribute
                var numberOfNoteStartAttributes = innerHTML.match(/note--start/g).length;
                var numberOfNoteEndAttributes = innerHTML.match(/note--end/g).length;
                expect(numberOfNoteStartAttributes).to.equal(1);
                expect(numberOfNoteEndAttributes).to.equal(1);

                // Expect one start and one end note barrier
                var numberOfNoteStartAttributes = innerHTML.match(/note-barrier--start/g).length;
                var numberOfNoteEndAttributes = innerHTML.match(/note-barrier--end/g).length;
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

    when('we select a bit of text that spans several tags', function() {
      givenContentOf('<p>On the <b>24th of |February</b>The <b><i>look-out</i></b> at |Notre-Dame de la Garde signalled the three-master, the Pharaon from Smyrna</p>', function() {
        when('we press the noting key', function() {
          it('wraps the text in a note', function () {
            note().then(function () {
              scribeNode.getInnerHTML().then(function (innerHTML) {
                expect(innerHTML).to.include('February</gu-note></b>');
                expect(innerHTML).to.include('The </gu-note><b><i>');
                expect(innerHTML).to.include('look-out</gu-note></i></b>');
                expect(innerHTML).to.include(' at </gu-note>');

                // Expect one start and one end attribute
                var numberOfNoteStartAttributes = innerHTML.match(/note--start/g).length;
                var numberOfNoteEndAttributes = innerHTML.match(/note--end/g).length;
                expect(numberOfNoteStartAttributes).to.equal(1);
                expect(numberOfNoteEndAttributes).to.equal(1);

                // Expect one start and one end note barrier
                var numberOfNoteStartAttributes = innerHTML.match(/note-barrier--start/g).length;
                var numberOfNoteEndAttributes = innerHTML.match(/note-barrier--end/g).length;
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

    when('we are inside a note and haven\'t selected anything', function() {
      givenContentOf('<p>On the 24th of <gu-note class="note">Febr|uary, 1815, </gu-note>the look-out at Notre-Dame de la Garde signalled the three-master, the Pharaon from Smyrna</p>', function() {
        when('we press the noting key', function() {
          it('the note is unnoted', function () {
            note().then(function () {
              scribeNode.getInnerHTML().then(function (innerHTML) {
                expect(innerHTML).to.not.include('</gu-note>');
                expect(innerHTML).to.include('February, 1815, ');
              });
            });
          });
        });
      });
    });

    when('when the start of our selection is within a note and the end is within another note', function() {
      givenContentOf('<p><gu-note class="note">On the |24th of</gu-note> February, the look-out at <gu-note class="note">Notre-Dame de| la Garde</gu-note> signalled the three-master, the Pharaon from Smyrna</p>', function() {
        when('we press the noting key', function() {
          it('merges the two notes together with the text inbetween', function () {
            note().then(function () {
              scribeNode.getInnerHTML().then(function (innerHTML) {
                expect(innerHTML).to.include('the 24th of</gu-note>');
                expect(innerHTML).to.include('look-out at </gu-note>');
                expect(innerHTML).to.include('Notre-Dame de la Garde</gu-note>');

                // Expect one start and one end attribute
                var numberOfNoteStartAttributes = innerHTML.match(/note--start/g).length;
                var numberOfNoteEndAttributes = innerHTML.match(/note--end/g).length;
                expect(numberOfNoteStartAttributes).to.equal(1);
                expect(numberOfNoteEndAttributes).to.equal(1);

                // Expect one start and one end note barrier
                var numberOfNoteStartAttributes = innerHTML.match(/note-barrier--start/g).length;
                var numberOfNoteEndAttributes = innerHTML.match(/note-barrier--end/g).length;
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


    /**
    * Unnote part of a note
    *
    * TODO: Make the expectations more specific.
    */

    when('we select some text within a note', function() {
      givenContentOf('<p>On the 24th of <gu-note class="note">Febr|uary|, 1815, </gu-note>the look-out at Notre-Dame de la Garde signalled the three-master, the Pharaon from Smyrna</p>', function() {
        when('we press the noting key', function() {
          it('the selected part within the note is unnoted', function () {
            note().then(function () {
              scribeNode.getInnerHTML().then(function (innerHTML) {
                // Expect two notes with note--start and note--end classes.
                var numberOfNoteStartAttributes = innerHTML.match(/note--start/g).length;
                var numberOfNoteEndAttributes = innerHTML.match(/note--end/g).length;
                expect(numberOfNoteStartAttributes).to.equal(2);
                expect(numberOfNoteEndAttributes).to.equal(2);

                // Expect two notes with start and end note barriers
                var numberOfNoteStartAttributes = innerHTML.match(/note-barrier--start/g).length;
                var numberOfNoteEndAttributes = innerHTML.match(/note-barrier--end/g).length;
                expect(numberOfNoteStartAttributes).to.equal(2);
                expect(numberOfNoteEndAttributes).to.equal(2);

              });
            });
          });
        });
      });
    });

    when('we select some text at the start of a note', function() {
      givenContentOf('<p>On the 24th of <gu-note class="note">|February|, 1815, </gu-note>the look-out at Notre-Dame de la Garde signalled the three-master, the Pharaon from Smyrna</p>', function() {
        when('we press the noting key', function() {
          it('the selected part within the note is unnoted', function () {
            note().then(function () {
              scribeNode.getInnerHTML().then(function (innerHTML) {
                // Expect two notes with note--start and note--end classes.
                var numberOfNoteStartAttributes = innerHTML.match(/note--start/g).length;
                var numberOfNoteEndAttributes = innerHTML.match(/note--end/g).length;
                expect(numberOfNoteStartAttributes).to.equal(1);
                expect(numberOfNoteEndAttributes).to.equal(1);

                // Expect one start and one end note barrier
                var numberOfNoteStartAttributes = innerHTML.match(/note-barrier--start/g).length;
                var numberOfNoteEndAttributes = innerHTML.match(/note-barrier--end/g).length;
                expect(numberOfNoteStartAttributes).to.equal(1);
                expect(numberOfNoteEndAttributes).to.equal(1);
              });
            });
          });
        });
      });
    });

    when('we select some text at the end of a note', function() {
      givenContentOf('<p>On the 24th of <gu-note class="note">February|, 1815, |</gu-note>the look-out at Notre-Dame de la Garde signalled the three-master, the Pharaon from Smyrna</p>', function() {
        when('we press the noting key', function() {
          it('the selected part within the note is unnoted', function () {
            note().then(function () {
              scribeNode.getInnerHTML().then(function (innerHTML) {
                // Expect two notes with note--start and note--end classes.
                var numberOfNoteStartAttributes = innerHTML.match(/note--start/g).length;
                var numberOfNoteEndAttributes = innerHTML.match(/note--end/g).length;
                expect(numberOfNoteStartAttributes).to.equal(1);
                expect(numberOfNoteEndAttributes).to.equal(1);

                // Expect one start and one end note barrier
                var numberOfNoteStartAttributes = innerHTML.match(/note-barrier--start/g).length;
                var numberOfNoteEndAttributes = innerHTML.match(/note-barrier--end/g).length;
                expect(numberOfNoteStartAttributes).to.equal(1);
                expect(numberOfNoteEndAttributes).to.equal(1);
              });
            });
          });
        });
      });
    });

    // when('we select the contents of a note', function() {
    //   givenContentOf('<p>On the 24th of <gu-note class="note">|February, 1815, |</gu-note>the look-out at Notre-Dame de la Garde signalled the three-master, the Pharaon from Smyrna</p>', function() {
    //     when('we press the noting key', function() {
    //       it('unnotes the note', function () {
    //         note().then(function () {
    //           scribeNode.getInnerHTML().then(function (innerHTML) {
    //             expect(innerHTML).to.not.include('</gu-note>');
    //           });
    //         });
    //       });
    //     });
    //   });
    // });

    // Merge notes


    /**
    * Feature: Unnote selected text
    */



  });

});