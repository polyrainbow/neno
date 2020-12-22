import * as Config from "./config.js";

const yyyymmdd = (date) => {
  const yyyy = date.getFullYear().toString();
  const mm = (date.getMonth() + 1).toString(); // getMonth() is zero-based
  const dd = date.getDate().toString();
  return (
    yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0])
  );
};

const htmlDecode = (input) => {
  const doc = new DOMParser().parseFromString(input, "text/html");
  return doc.documentElement.textContent;
};

const getParameterByName = (name, url) => {
  if (!url) url = window.location.href;
  name = name.replace(/[[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};


const getNumberOfCharacters = (note) => {
  return note.editorData.blocks.reduce((accumulator, block) => {
    if (["paragraph", "header"].includes(block.type) && block.data?.text) {
      return accumulator + block.data.text.length;
    } else {
      return accumulator;
    }
  }, 0);
};


const makeTimestampHumanReadable = (timestamp) => {
  return (new Date(timestamp)).toString();
};


const getNewNoteObject = () => {
  const note = {
    changes: [],
    creationTime: null,
    editorData: Config.newEditorDataObject,
    id: null,
    isUnsaved: true,
    linkedNotes: [],
    updateTime: null,
    position: {
      x: null,
      y: null,
    },
  };

  Object.seal(note);
  return note;
};


const setNoteTitleByLinkTitleIfUnset = (note, defaultNoteTitle) => {
  // if the note has no title yet, take the title of the link metadata
  const firstLinkBlock = note.editorData.blocks.find(
    (block) => block.type === "linkTool",
  );

  if (
    (note.editorData?.blocks?.[0]?.data?.text
      === defaultNoteTitle)
    && firstLinkBlock
    && typeof firstLinkBlock.data.meta.title === "string"
    && firstLinkBlock.data.meta.title.length > 0
  ) {
    note.editorData.blocks[0].data.text
      = firstLinkBlock.data.meta.title;
  }
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


export {
  yyyymmdd,
  htmlDecode,
  getParameterByName,
  getNumberOfCharacters,
  makeTimestampHumanReadable,
  getNewNoteObject,
  setNoteTitleByLinkTitleIfUnset,
  binaryArrayFind,
  binaryArrayIncludes,
};
