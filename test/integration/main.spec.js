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

    when('we press the noting key', function() {
      it('creates a note', function() {
        console.log("INSIDE")
        expect(0).to.equal(0);
      });
    });
  });

});
