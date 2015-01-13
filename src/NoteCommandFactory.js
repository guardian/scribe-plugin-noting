var emitter = require('./utils/emitter');

var isSelectionWithinANote = require('./utils/is-dom-selection-within-a-note');

//generate a note command
function generateNoteCommand(scribe, tagName){
  var command = new scribe.api.Command('insetHTML');

  command.execute = function(){
    emmitter.trigger('command:note', tagName);
  };

  command.queryState = function(){
    var selection = new scribe.api.selection();
    return isSelectionWithinANote(selection.range, scribe.el);
  };

  command.queryEnabled = function(){ return true; };

  return command;
}

module.exports = function NoteCommandFactory(scribe, commandName = 'note', tagName = 'gu-note'){
  //createNoteCommand
  scribe[commandName] = generateNoteCommand(scribe, tagName);
}
