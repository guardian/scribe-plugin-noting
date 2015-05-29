// Check if VNode has class
module.exports = function hasClass(vNode, value) {

  if (!vNode || !vNode.properties || !vNode.properties.className) {
    return false;
  }

  const classes = vNode.properties.className.split(' ');
  return classes.some(cl => value === cl);
};
