module.exports = function userAndTimeAsDatasetAttrs(user) {
  return {
    "noteEditedBy": user,
    "noteEditedDate": new Date().toISOString()
  };
};


