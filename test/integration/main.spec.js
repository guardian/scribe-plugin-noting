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

var _ = require('lodash');

function loadPlugin() {
  return driver.executeAsyncScript(function (done) {
    require(['../../src/scribe-plugin-noting'], function (scribePluginNoting) {
      window.scribe.use(scribePluginNoting("A User"));
      done();
    });
  });
}

// Press the noting key. Returns promise.
function note() {
  return scribeNode.sendKeys(webdriver.Key.F10);
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
          expect(innerHTML).to.not.include('</gu:note>');
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
            expect(innerHTML).to.include('</gu:note>');
            // We also expect the caret to be placed within the note.
            // Add expectation if you can figure out how to test that.

            // Note id specs
            expect(innerHTML).to.include('data-note-id=');

            var noteIds = innerHTML.match(/data-note-id="(.*?)"/g);
            expect(noteIds).to.have.length(1);
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
                expect(innerHTML).to.include('February, 1815, </gu:note>');

                // Note id specs
                expect(innerHTML).to.include('data-note-id=');

                var noteIds = innerHTML.match(/data-note-id="(.*?)"/g);
                expect(noteIds).to.have.length(1);
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
                expect(innerHTML).to.include('February</gu:note></b>');
                expect(innerHTML).to.include('The </gu:note><b><i>');
                expect(innerHTML).to.include('look-out</gu:note></i></b>');
                expect(innerHTML).to.include(' at </gu:note>');

                // Note id specs
                expect(innerHTML).to.include('data-note-id=');
                var noteIds = innerHTML.match(/data-note-id="(.*?)"/g);
                var allHaveSameId = _.uniq(noteIds).length === 1;

                expect(noteIds).to.have.length(4);
                expect(allHaveSameId).to.be.true;
              });
            });
          });
        });
      });
    });

    when('we are inside a note and haven\'t selected anything', function() {
      givenContentOf('<p>On the 24th of <gu:note data-note-id="ba641e61-069c-423b-eeaa-b8ef2f54d1c1" class="note">Febr|uary, 1815, </gu:note>the look-out at Notre-Dame de la Garde signalled the three-master, the Pharaon from Smyrna</p>', function() {
        when('we press the noting key', function() {
          it('no new note is created', function () {
            note().then(function () {
              scribeNode.getInnerHTML().then(function (innerHTML) {
                var noteIds = innerHTML.match(/data-note-id="(.*?)"/g);
                expect(noteIds).to.have.length(1);
              });
            });
          });
        });
      });
    });

    // when('we select the contents of a note', function() {
    //   givenContentOf('<p>On the 24th of <gu:note data-note-id="ba641e61-069c-423b-eeaa-b8ef2f54d1c1" class="note">|February, 1815, |</gu:note>the look-out at Notre-Dame de la Garde signalled the three-master, the Pharaon from Smyrna</p>', function() {
    //     when('we press the noting key', function() {
    //       it('unnotes the note', function () {
    //         note().then(function () {
    //           scribeNode.getInnerHTML().then(function (innerHTML) {
    //             expect(innerHTML).to.not.include('</gu:note>');
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
