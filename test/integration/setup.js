var helpers = require('scribe-test-harness/helpers');
var initializeScribe = helpers.initializeScribe.bind(null, '../../node_modules/scribe-editor/src/scribe');
var loadPlugin = require('./helpers/load-plugin');

beforeEach(function() {
  return initializeScribe();
});

beforeEach(function() {
  loadPlugin();
});
