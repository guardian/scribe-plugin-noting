var state = true;

module.exports = {
  get: function() {
    return state;
  },
  set: function(val) {
    state = val;
  }
};
