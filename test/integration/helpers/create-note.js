/*
Presses the noting key
- returns a promise
*/

var webdriver = require('selenium-webdriver');
var helpers = require('scribe-test-harness/helpers');
var scribeNode;

beforeEach(function (){
  scribeNode = helpers.scribeNode;
})

module.exports = function note(){
  return scribeNode.sendKeys(webdriver.Key.F10);
}
