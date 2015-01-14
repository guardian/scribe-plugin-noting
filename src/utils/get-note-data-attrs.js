var config = require('../config');

module.exports = function userAndTimeAsDatasetAttrs() {

  var user = config.get('user');

  return {
    "noteEditedBy": user,
    "noteEditedDate": new Date().toISOString()
  };
};


