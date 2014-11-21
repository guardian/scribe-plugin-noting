module.exports = function(node, tag){
  return node.tagName && node.tagName.toLowerCase() === tag;
};
