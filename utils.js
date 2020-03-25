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


/*
  @function binaryArrayFind:
    This function performs a binary search in an array of objects that is
    sorted by a specific key in the objects.

  @param sortedArray:
    An array of objects that is sorted by a specific key in the objects.
  @param sortKeyKey:
    They key of the object whose corresponding value is the sort key for
    that object.
  @param sortKeyKey:
    The sort key we want to find.
*/
const binaryArrayFind = function(sortedArray, sortKeyKey, sortKeyToFind) {
  let start = 0;
  let end = sortedArray.length - 1;

  while (start <= end) {
    // Find the mid index
    const mid = Math.floor((start + end) / 2);

    // If element is present at mid, return it
    if (sortedArray[mid][sortKeyKey] === sortKeyToFind) {
      return sortedArray[mid];
    // Else look in left or right half accordingly
    } else if (sortedArray[mid][sortKeyKey] < sortKeyToFind) {
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }

  return null;
};


/*
  @function binaryArrayIncludes:
    This function performs a binary search in the manner of Array.includes()
    in an array of values that has been sorted with Array.sort().

  @param sortedArray:
    An array of values that is sorted with Array.sort()
  @param valueToLookFor:
    The value we want to find.
*/
const binaryArrayIncludes = function(sortedArray, valueToLookFor) {
  let start = 0;
  let end = sortedArray.length - 1;

  while (start <= end) {
    // Find the mid index
    const mid = Math.floor((start + end) / 2);

    // If element is present at mid, we have it
    if (sortedArray[mid] === valueToLookFor) {
      return true;
    // Else look in left or right half accordingly
    } else if (sortedArray[mid] < valueToLookFor) {
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }

  return false;
};


const cloneObject = function(obj) {
  let clone = {};

  if (Array.isArray(obj)) {
    clone = [];
  }

  for (const i in obj) {
    if (obj[i] && typeof obj[i] === "object") {
      clone[i] = cloneObject(obj[i]);
    } else {
      clone[i] = obj[i];
    }
  }

  return clone;
};


module.exports = {
  getKeySortFunction,
  binaryArrayFind,
  binaryArrayIncludes,
  cloneObject,
};
