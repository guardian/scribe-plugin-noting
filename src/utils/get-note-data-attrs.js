module.exports = function userAndTimeAsDatasetAttrs(user) {

  user = (user || 'unknown');

  return {
    "noteEditedBy": user,
    "noteEditedDate": new Date().toISOString()
  };
};


