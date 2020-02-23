const getKeySortFunction = function(key, doCaseInsensitiveSort) {
  return function(a, b) {
    let x = a[key];
    let y = b[key];

    if (doCaseInsensitiveSort && (typeof x === "string")) {
      x = x.toLowerCase();
      y = y.toLowerCase();
    }

    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  };
};

module.exports = {
  getKeySortFunction,
};
