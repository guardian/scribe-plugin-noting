var path = require('path');
var glob = require('glob');
var Mocha = require('mocha');
var createRunner = require('scribe-test-harness/create-runner');

var mocha = new Mocha();

/**
 * Wait for the connection to Sauce Labs to finish.
 */
mocha.timeout(15 * 1000);
mocha.timeout(1200000);
mocha.reporter('spec');

mocha.addFile(path.resolve(__dirname, 'setup.js'));

glob(__dirname + '**/*.spec.js', function (err, files){
  if(err){process.exit(1);}

  files.forEach( function (filePath){
    mocha.addFile(filePath);
  })

  createRunner(mocha);

});

