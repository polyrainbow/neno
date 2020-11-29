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
    editorData: null,
    id: null,
    isUnsaved: true,
    linkedNotes: null,
    updateTime: null,
    x: null,
    y: null,
  };

  Object.seal(note);
  return note;
};


const getSortFunction = (sortBy) => {
  const sortFunctions = {
    "CREATION_DATE_ASCENDING": (a, b) => {
      return a.creationTime - b.creationTime;
    },
    "CREATION_DATE_DESCENDING": (a, b) => {
      return b.creationTime - a.creationTime;
    },
    "UPDATE_DATE_ASCENDING": (a, b) => {
      return a.updateTime - b.updateTime;
    },
    "UPDATE_DATE_DESCENDING": (a, b) => {
      return b.updateTime - a.updateTime;
    },
    "NUMBER_OF_LINKS_ASCENDING": (a, b) => {
      return a.numberOfLinkedNotes - b.numberOfLinkedNotes;
    },
    "NUMBER_OF_LINKS_DESCENDING": (a, b) => {
      return b.numberOfLinkedNotes - a.numberOfLinkedNotes;
    },
  };

  return sortFunctions[sortBy] ?? sortFunctions.UPDATE_DATE_ASCENDING;
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


export {
  yyyymmdd,
  htmlDecode,
  getParameterByName,
  getNumberOfCharacters,
  makeTimestampHumanReadable,
  getNewNoteObject,
  getSortFunction,
  setNoteTitleByLinkTitleIfUnset,
};
