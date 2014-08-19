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


  });

});
