module.exports = function toCamelCase(string){
  return string.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase().replace('-','');});
};
