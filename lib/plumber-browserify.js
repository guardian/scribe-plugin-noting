/**
 * Browserify plumber operation.
 */

var operation = require('plumber').operation;
var Report = require('plumber').Report;

var path = require('path');
var highland = require('highland');
var browserify = require('browserify');

module.exports = function(options) {
  options = options || {};


  return operation.parallelFlatMap(function(resource) {
    var basePath = process.cwd();

    // Browserify needs the full absolute path for processing
    var resourceFullPath = path.resolve(basePath, resource.path().absolute());

    var browserifyOptions = {
      entries: [ resourceFullPath ],
      debug: false, // TODO: sourcemaps by default
      standalone: options.standalone || undefined,

      // other browserify options with defaults, expose as options as necessary
      basedir: undefined,
      builtins: undefined,
      bundleExternal: true,
      commondir: undefined,
      detectGlobals: true,
      extensions: [],
      fullPaths: false,
      ignoreMissing: false,
      insertGlobals: false,
      insertGlobalVars: undefined,
      noparse: undefined
    },

    b = browserify(browserifyOptions);

    // TODO: exclude dependencies as an option
    // b.exclude('lodash');


    // browserify source requires "this" to be a browserify instance,
    // highland's wrapCallback omits this when wrapping the function.
    function bundleWrapper(cb) {
      return b.bundle(cb);
    }

    var bundle = highland.wrapCallback(bundleWrapper);
    return bundle()
      .map(function(data) {
        return resource.withRawData(data);
      })
      .errors(function (err, push) {
        console.error('Error!', err.message);

        // TODO: Expose a plumber error message
      });

  });
}
