var _ = require('lodash');

//defaults
var config = {
  user: 'unknown',
  nodeName: 'GU-NOTE',
  tagName: 'gu-note',
  classname: 'note',
  dataName: 'data-note-edited-by',
  dataNameCamel: 'dataNoteEditedBy',
  dataDate: 'data-note-edited-date',
  dataDateCamel: 'dataNoteEditedDate',
  noteBarrierTag: 'gu-note-barrier',
  noteCollapsedClass: 'note--collapsed'
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
    if(_.isObject(key)){
      config = _.extend({}, config, key);
    }

    //else set a specific key
    config[key] = val;
  }

};
