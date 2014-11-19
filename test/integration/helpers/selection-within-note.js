var helpers = require('scribe-test-harness/helpers');
var driver;

before(function(){
  driver = helpers.driver;
});

module.exports = function selectionIsInsideNote() {
  return driver.executeScript(function () {

    function domWalkUpCheck(node, predicate) {
     if (!node.parentNode) { return false; }
     return predicate(node) ? true : domWalkUpCheck(node.parentNode, predicate);
    }

    // Checks whether our selection is within another note.
     var node = window.getSelection().getRangeAt(0).startContainer;

     return domWalkUpCheck(node, function(node) {
       return node.tagName === 'GU-NOTE';
     });

  });
}



