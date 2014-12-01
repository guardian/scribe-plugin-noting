module.exports = function isTag(node, tag){
  return node.tagName && node.tagName.toLowerCase() === tag;
};
