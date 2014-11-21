var helpers = require('scribe-test-harness/helpers');
var initializeScribe = helpers.initializeScribe.bind(null, '../../bower_components/scribe/src/scribe');
var loadPlugin = require('./helpers/load-plugin');

beforeEach(function() {
  return initializeScribe();
});

beforeEach(function() {
  loadPlugin();
});
