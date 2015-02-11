var chai = require('chai');
var webdriver = require('selenium-webdriver');
var helpers = require('scribe-test-harness/helpers');

var expect = chai.expect;

var when = helpers.when;
var given = helpers.given;
var givenContentOf = helpers.givenContentOf;

var scribeNode;
var driver;
beforeEach(function() {
  scribeNode = helpers.scribeNode;
  driver = helpers.driver;
});

var flag = require('./helpers/create-flag');

var selectionIsInsideNote = require('./helpers/selection-within-note');

describe('Creating Scribe Flags', function() {

  // Create flag at caret
  given('No selection', function() {
    givenContentOf('<p>On the 24th of | February, 1815, the look-out at Notre-Dame de la Garde signalled the three-master, the Pharaon from Smyrna</p>', function() {
      when('pressing the flag key', function() {

        it('wraps the caret in a flag note', function() {
          flag().then(function() {
            scribeNode.getInnerHTML().then(function(innerHTML) {

              expect(innerHTML).to.include('</gu-flag>');

              // Expect one start and one end attribute
              var numberOfNoteStartAttributes = innerHTML.match(/note--start/g).length;
              var numberOfNoteEndAttributes = innerHTML.match(/note--end/g).length;
              var numberOfNoteUndefinedElements = innerHTML.match(/undefined/g);


              expect(numberOfNoteStartAttributes).to.equal(1);
              expect(numberOfNoteEndAttributes).to.equal(1);
              expect(numberOfNoteUndefinedElements).to.be.a('null');

              //we need to check that the interaction types are specified correctly
              expect(innerHTML).to.include('data-click');
              expect(innerHTML).to.include('toggle-tag');

              expect(innerHTML).to.include('data-note-edited-by');
              expect(innerHTML).to.include('data-note-edited-date');

              selectionIsInsideNote().then(function(result) {
                expect(result).to.be.false;
              });

            });
          });
        });
      });
    });
  });

  // Create flag from selection
  given('A selection', function() {
    givenContentOf('<p>On the 24th of | February, 1815|, the look-out at Notre-Dame de la Garde signalled the three-master, the Pharaon from Smyrna</p>', function() {
      when('pressing the flag key', function() {

        it('wraps the text in a flag note', function() {
          flag().then(function() {
            scribeNode.getInnerHTML().then(function(innerHTML) {

              expect(innerHTML).to.include(' February, 1815</gu-flag>');

              // Expect one start and one end attribute
              var numberOfNoteStartAttributes = innerHTML.match(/note--start/g).length;
              var numberOfNoteEndAttributes = innerHTML.match(/note--end/g).length;
              var numberOfNoteUndefinedElements = innerHTML.match(/undefined/g);
              var numberOfDataClickAttributes = innerHTML.match(/data-click-action/g).length;

              expect(numberOfNoteStartAttributes).to.equal(1);
              expect(numberOfNoteEndAttributes).to.equal(1);
              expect(numberOfDataClickAttributes).to.equal(1);
              expect(numberOfNoteUndefinedElements).to.be.a('null');

              expect(innerHTML).to.include('data-note-edited-by');
              expect(innerHTML).to.include('data-note-edited-date');

              selectionIsInsideNote().then(function(result) {
                expect(result).to.be.false;
              });

            });
          });
        });
      });
    });
  });


  //click interactions
  given('we already have a flag', function() {

    var content = [
      '<gu-flag data-click-action="toggle-tag" class="note" data-note-id="1234">Start</gu-flag>',
      '<gu-flag data-click-action="toggle-tag" class="note" data-note-id="1234">Middle</gu-flag>',
      '<gu-flag data-click-action="toggle-tag" class="note" data-note-id="1234" id="end-note">End</gu-flag>'
    ].join('');

    when('we click a flag', function(){
      givenContentOf(content, function() {
        it('should toggle tag names', function() {

          driver.executeScript(function() {
            document.getElementById('end-note').click();
          });

          scribeNode.getInnerHTML()
          .then(function(innerHTML) {
            expect(innerHTML.match(/gu-correct/g).length).to.equal(6);
            driver.executeScript(function() {
              document.getElementById('end-note').click();
            });
            return scribeNode.getInnerHTML();
          })
          .then(function(innerHTML){
            expect(innerHTML.match(/gu-flag/g).length).to.equal(6);
          });

        });
      });
    });
  });



});
