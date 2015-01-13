var emitter = require('./utils/emitter');
var config = require('./config');

var noteCollapseState = require('./utils/collapse-state');
var isSelectionWithinANote = require('./utils/is-dom-selection-within-a-note');

//generate a note command
function generateNoteCommand(scribe, tagName){
  var command = new scribe.api.Command('insertHTML');

  command.execute = function(){
    emitter.trigger('command:note', [tagName]);
  };

  command.queryState = function(){
    var selection = new scribe.api.Selection();
    return isSelectionWithinANote(selection.range, scribe.el);
  };

  command.queryEnabled = function(){ return true; };

  return command;
}

//generate a command for toggling a sigle note
function generateToggleSingleNoteCommand(scribe, tagName){
  var command = new scribe.api.Command('insertHTML');

  command.execute = function(){
    emitter.trigger('command:toggle:single-note', [tagName]);
  };

  return command;
}

//generate a command for toggling all notes
function generateToggleAllNotesCommand(scribe, tagName){
  var command = new scribe.api.Command('insertHTML');

  command.execute = function(){
    emitter.trigger('command:toggle:all-notes', [tagName]);
  };

  command.queryEnabled = function(){
    return !!scribe.el.getElementsByTagName(tagName).length;
  };

  command.queryState = function(){
    return this.queryEnabled() && noteCollapseState.get();
  }

  return command;
}

module.exports = function NoteCommandFactory(scribe, commandName = 'note', tagName = 'gu-note'){
  //createNoteCommand
  scribe.commands[commandName] = generateNoteCommand(scribe, tagName);

  //toggle a single note i.e. when its clicked
  var toggleSingleNoteCommandName = commandName + 'CollapseToggle';
  scribe.commands[toggleSingleNoteCommandName] = generateToggleSingleNoteCommand(scribe, tagName);

  //toggle ALL notes
  var toggleAllNotesCommandName = toggleSingleNoteCommandName + 'All';
  scribe.commands[toggleAllNotesCommandName] = generateToggleAllNotesCommand(scribe, tagName);
}
