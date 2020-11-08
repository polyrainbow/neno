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


export {
  yyyymmdd,
  htmlDecode,
  getParameterByName,
  getNumberOfCharacters,
  makeTimestampHumanReadable,
};
