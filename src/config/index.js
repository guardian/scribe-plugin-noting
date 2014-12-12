var _ = require('lodash');

//defaults
var config = {
  user: 'unknown'
};

module.exports = {

  get: function(key){
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
