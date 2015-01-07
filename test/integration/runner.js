var path = require('path');
var glob = require('glob');
var Q = require('q');
var Mocha = require('mocha');
var createRunner = require('scribe-test-harness/create-runner');

var mocha = new Mocha();

var pGlob = Q.denodeify(glob);

/**
 * Wait for the connection to Sauce Labs to finish.
 */
mocha.timeout(15 * 1000);
mocha.timeout(1200000);
mocha.reporter('spec');


mocha.addFile(path.resolve(__dirname, 'setup.js'));

var testDir = path.resolve(__dirname, '../');
var unitDir = testDir + '/unit/**/*.spec.js';
var integrationDir = testDir + '/integration/**/*.spec.js';

//add an array of files to mocha
function addFiles(files) {
  files.forEach(function(filePath) {
    mocha.addFile(filePath);
  })
}

pGlob(unitDir)
  //add unit test files first
  .then(function(unitTestFiles) {
    addFiles(unitTestFiles);
    return pGlob(integrationDir);
  })
  //add integration test files
  .then(function(integrationTestFiles) {
    return addFiles(integrationTestFiles);
  })
  //setup the runner
  .then(function() {
    createRunner(mocha);
  })
  //catch any errors
  .catch(function(err) {
    console.log(err);
    process.exit(1);
  });
