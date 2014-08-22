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

    when('we press the noting key', function () {
      it('creates a note', function () {
        note().then(function () {
          scribeNode.getInnerHTML().then(function (innerHTML) {
            expect(innerHTML).to.include('</gu:note>');
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
              });
            });
          });
        });
      });
    });


  });

});
