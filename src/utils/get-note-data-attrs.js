var config = require('../config');

module.exports = function userAndTimeAsDatasetAttrs() {

  user = config.get('user');

  return {
    "noteEditedBy": user,
    "noteEditedDate": new Date().toISOString()
  };
};


