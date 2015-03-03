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

var note = require('./helpers/create-note');

describe('Removing a Scribe Note', function() {

  // Caret remove
  given('the caret is within a note', function() {
    when('we are inside a note and haven\'t selected anything', function() {
      givenContentOf('<p>On the 24th of <gu-note class="note">Febr|uary, 1815, </gu-note>the look-out at Notre-Dame de la Garde signalled the three-master, the Pharaon from Smyrna</p>', function() {
        when('we press the noting key', function() {
          it('the note is unnoted', function() {
            note().then(function() {
              scribeNode.getInnerHTML().then(function(innerHTML) {
                expect(innerHTML).to.not.include('</gu-note>');
                expect(innerHTML).to.include('February, 1815, ');
              });
            });
          });
        });
      });
    });
  });


  given('a selection', function() {

    // Remove note
    when('we select the contents of a note', function() {
      givenContentOf('<p>On the 24th of <gu-note class="note">|February, 1815, |</gu-note>the look-out at Notre-Dame de la Garde signalled the three-master, the Pharaon from Smyrna</p>', function() {
        when('we press the noting key', function() {
          it('unnotes the note', function() {
            note().then(function() {
              scribeNode.getInnerHTML().then(function(innerHTML) {
                expect(innerHTML).to.not.include('</gu-note>');
              });
            });
          });
        });
      });
    });

    when('we select the contents of a note except for a space', function() {
      givenContentOf('<p>On the 24th of <gu-note class="note"> |February, 1815, |</gu-note>the look-out at Notre-Dame de la Garde signalled the three-master, the Pharaon from Smyrna</p>', function() {
        when('we press the noting key', function() {
          it('unnotes the note', function() {
            note().then(function() {
              scribeNode.getInnerHTML().then(function(innerHTML) {
                expect(innerHTML).to.not.include('</gu-note>');
              });
            });
          });
        });
      });
    });

    // Remove Part of a Note
    when('we select some text within a note', function() {
      givenContentOf('<p>On the 24th of <gu-note class="note">Febr|uary|, 1815, </gu-note>the look-out at Notre-Dame de la Garde signalled the three-master, the Pharaon from Smyrna</p>', function() {
        when('we press the noting key', function() {
          it('the selected part within the note is unnoted', function() {
            note().then(function() {
              scribeNode.getInnerHTML().then(function(innerHTML) {
                // Expect two notes with note--start and note--end classes.
                var numberOfNoteStartAttributes = innerHTML.match(/note--start/g).length;
                var numberOfNoteEndAttributes = innerHTML.match(/note--end/g).length;
                expect(numberOfNoteStartAttributes).to.equal(2);
                expect(numberOfNoteEndAttributes).to.equal(2);
              });
            });
          });
        });
      });
    });

    when('we select some text at the end of a note', function() {
      givenContentOf('<p>On the 24th of <gu-note class="note">February|, 1815, |</gu-note>the look-out at Notre-Dame de la Garde signalled the three-master, the Pharaon from Smyrna</p>', function() {
        when('we press the noting key', function() {
          it('the selected part within the note is unnoted', function() {
            note().then(function() {
              scribeNode.getInnerHTML().then(function(innerHTML) {
                // Expect two notes with note--start and note--end classes.
                var numberOfNoteStartAttributes = innerHTML.match(/note--start/g).length;
                var numberOfNoteEndAttributes = innerHTML.match(/note--end/g).length;
                expect(numberOfNoteStartAttributes).to.equal(1);
                expect(numberOfNoteEndAttributes).to.equal(1);
              });
            });
          });
        });
      });
    });

    when('we select some text at the start of a note', function() {
      givenContentOf('<p>On the 24th of <gu-note class="note">|February|, 1815, </gu-note>the look-out at Notre-Dame de la Garde signalled the three-master, the Pharaon from Smyrna</p>', function() {
        when('we press the noting key', function() {
          it('the selected part within the note is unnoted', function() {
            note().then(function() {
              scribeNode.getInnerHTML().then(function(innerHTML) {
                // Expect two notes with note--start and note--end classes.
                var numberOfNoteStartAttributes = innerHTML.match(/note--start/g).length;
                var numberOfNoteEndAttributes = innerHTML.match(/note--end/g).length;
                expect(numberOfNoteStartAttributes).to.equal(1);
                expect(numberOfNoteEndAttributes).to.equal(1);
              });
            });
          });
        });
      });
    });

  });

  given('the caret is within a note', function() {
    when('we are inside a note and haven\'t selected anything', function() {
      givenContentOf('<p>On the 24th of <gu-note class="note">Febr|uary, 1815, </gu-note>the look-out at Notre-Dame de la Garde signalled the three-master, the Pharaon from Smyrna</p>', function() {
        when('we press the noting key', function() {
          it('the note is unnoted', function() {
            scribeNode.sendKeys(webdriver.Key.chord(webdriver.Key.CONTROL, 'b'));
            note().then(function() {
              scribeNode.getInnerHTML().then(function(innerHTML) {
                expect(innerHTML).to.not.include('</gu-note>');
                expect(innerHTML).to.include('February, 1815, ');
              });
            });

          });
        });
      });
    });
  });

  // This is here to prevent:
  // https://github.com/guardian/scribe-plugin-noting/issues/45
  given('we have a complete note', function() {
    when('we have a selection contained within a note', function() {
      givenContentOf('<p><gu-note class="note" data-note-id="1">on the 24th of february, 1815, the look-out |at| notre-dame de la garde signalled the three-master, the pharaon from smyrna</gu-note></p>', function() {
        when('we unote our selection', function() {
          it('should contain notes with two different id\'s', function() {

            note().then(function() {
              scribeNode.getInnerHTML().then(function(innerHTML) {

                var result = innerHTML.match(/data-note-id="(.[^"]+)"/g);
                expect(result[0]).to.not.equal(result[1]);

              });
            });

          });
        });
      });
    });
  });

  //testing to see that un-noting a single note segment doesnt add extra text see:
  //https://github.com/guardian/scribe-plugin-noting/issues/53
  given('we have a single note', function() {
    when('we have a selection contained within a note', function() {
      givenContentOf('<p>|This is some content.| Some more</p>', function() {
        when('we unote our selection', function() {
          it('should not duplicate any text', function() {
            note()
            .then(function(){
              return driver.executeScript(function(){
                var selection = window.getSelection();
                var range = document.createRange();
                var note = document.getElementsByTagName('gu-note')[0];

                range.setStart(note.lastChild, 10);
                range.setEnd(note.lastChild, 15);

                selection.removeAllRanges();
                selection.addRange(range);
                scribe.getCommand('note').execute();
              });
            })
            .then(function(){
              return scribeNode.getInnerHTML();
            })
            .then(function(innerHTML){
              expect(innerHTML.match(/more/g).length).to.equal(1);
            });
          });
        });
      });
    });
  });

  describe('Removing zero width spaces with a note', function(){
    given('we have a note', function(){
      givenContentOf('<p>|This is some content|</p>', function(){
        when('we remove the note', function(){
          it.only('should remove all zero width spaces', function(){
            //create a note
            note()
              //re-position the caret
              .then(()=> scribeNode.sendKeys(webdriver.Key.ARROW_LEFT))
              .then(()=> scribeNode.sendKeys(webdriver.Key.ARROW_LEFT))
              //remove the note
              .then(()=> note())
              .then(()=> scribeNode.getInnerHTML())
              .then((html)=>{
                //expect zero width spaces to have been stripped
                expect(html).not.to.include('\u200BThis');
                expect(html).not.to.include('content\u200B');
              });
          });
        });
      });
    });
  });


});
