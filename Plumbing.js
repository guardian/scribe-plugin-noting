/*
 * Warning: shameless self-plug!
 * Plumber is the Guardian’s tool of choice for build systems.
 * https://github.com/plumberjs/plumber
 */

var all       = require('plumber-all');
var glob      = require('plumber-glob');
var requireJS = require('plumber-requirejs');
var uglifyJS  = require('plumber-uglifyjs');
var less      = require('plumber-less');
var write     = require('plumber-write');
var browserify = require('./lib/plumber-browserify');


module.exports = function(pipelines) {
  var toBuildDir = write('./build');
  var writeBoth = all(
    // Send the resource along these branches
    [uglifyJS(), toBuildDir],
    toBuildDir
  );

  pipelines['build:js'] = [
    glob('scribe-plugin-noting.js'),

    browserify({
      standalone: 'scribe-plugin-noting',
      external: ['lodash']
    }),

    writeBoth
  ];

  pipelines['build:css'] = [
    glob('src/skins/*.less'),
    less(),
    write('./build/skins')
  ];

  pipelines['build'] = all(
    pipelines['build:js'],
    pipelines['build:css']
  );
};
