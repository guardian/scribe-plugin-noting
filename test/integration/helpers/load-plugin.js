var helpers = require('scribe-test-harness/helpers');
var driver;

before(function(){
  driver = helpers.driver;
})

module.exports = function loadPlugin() {
  return driver.executeAsyncScript(function (done) {
    require(['../../build/scribe-plugin-noting.js'], function (scribePluginNoting) {
      window.scribe.use(scribePluginNoting("A User"));
      done();
    });
  });
}

