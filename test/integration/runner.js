var Mocha = require('mocha');
var createRunner = require('scribe-test-harness/create-runner');

var mocha = new Mocha();

/**
 * Wait for the connection to Sauce Labs to finish.
 */
mocha.timeout(15 * 1000);
mocha.timeout(1200000);
mocha.reporter('spec');
mocha.addFile(__dirname + '/main.spec.js');

createRunner(mocha);
