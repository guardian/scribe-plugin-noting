var assign = require('lodash.assign');
var isObject = require('lodash.isobject');

//defaults
var config = {
  user: 'unknown',
  nodeName: 'GU-NOTE',
  tagName: 'gu-note',
  defaultTagName: 'gu-note',
  className: 'note',
  defaultClassName: 'note',
  noteStartClassName: 'note--start',
  noteEndClassName: 'note--end',
  dataName: 'data-note-edited-by',
  dataNameCamel: 'dataNoteEditedBy',
  dataDate: 'data-note-edited-date',
  dataDateCamel: 'dataNoteEditedDate',
  noteBarrierTag: 'gu-note-barrier',
  noteCollapsedClass: 'note--collapsed',
  scribeInstanceSelector: '.scribe',
  defaultClickInteractionType: 'collapse',
  selectors: [
    { commandName: 'note',    tagName: 'gu-note',    clickAction: 'collapse',   keyCodes: [119, 121, {'altKey': 8}] },
    { commandName: 'flag',    tagName: 'gu-flag',    clickAction: 'toggle-tag', toggleTagTo: 'gu-correct', keyCodes: [120] },
    { commandName: 'correct', tagName: 'gu-correct', clickAction: 'toggle-tag', toggleTagTo: 'gu-flag', keyCodes: [] }
  ]
};

module.exports = {

  get: function(key){

    if(!key){
      return config;
    }

    return (config[key] || undefined);
  },

  set: function(key, val){

    //if you pass an object we override ALL THE THINGS
    if(isObject(key)){
      config = assign({}, config, key);
    }

    //else set a specific key
    config[key] = val;
  }

};
