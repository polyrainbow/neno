/*
  this custom loader replaces the js imports in ts files with ts imports, so
  that webpack can find the files.
  This file must be a cjs file for now, because webpack loads loaders with
  cjs require under the hood. there seems to be no way to change this for now.
*/

module.exports = function(source) {
  const newSource = source.replace(/^(.*)(\.js";)$/gm, "$1\";");
  return newSource;
};

