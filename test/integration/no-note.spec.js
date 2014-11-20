var chai = require('chai');
var webdriver = require('selenium-webdriver');
var helpers = require('scribe-test-harness/helpers');

var expect = chai.expect;

var when = helpers.when;
var given = helpers.given;

var scribeNode;
beforeEach(function() {
  scribeNode = helpers.scribeNode;
});


describe('The Scribe Noting Plugin', function() {
  given('we are in a scribe element', function() {
    when('we haven\'t pressed any key', function() {
      it('should contain no noting elements', function() {

        scribeNode.getInnerHTML().then(function(innerHTML) {
          expect(innerHTML).to.not.include('</gu-note>');
        });

      });
    });
  });
});
