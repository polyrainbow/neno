import { API_URL } from "./config.js";
import { yyyymmdd } from "./utils.js";

const getNote = async (noteId) => {
  const response = await fetch(API_URL + "note/" + noteId, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const note = await response.json();
  return note;
};


const getNotes = async (options) => {
  const query = options?.query;
  const caseSensitive = options?.caseSensitive;

  let url = API_URL + "notes";
  if (typeof query === "string") {
    url = url
      + "?q=" + encodeURIComponent(query)
      + "&caseSensitive=" + caseSensitive;
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const notes = await response.json();
  return notes;
};


const putNote = async (note) => {
  const response = await fetch(API_URL + "note", {
    method: "PUT",
    body: JSON.stringify(note),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const noteFromServer = (await response.json()).note;
  return noteFromServer;
};


const deleteNote = async (noteId) => {
  await fetch(
    API_URL + "note/" + noteId,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
};


const getDatabaseAsJSON = async () => {
  const response = await fetch(API_URL + "database/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.text();
  return json;
};


const getGraph = async () => {
  const response = await fetch(API_URL + "graph", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  return json;
};


const archiveDatabase = async () => {
  const json = await getDatabaseAsJSON();
  const blob = new Blob([json], {
    type: "application/json",
  });
  const dateSuffix = yyyymmdd(new Date());
  // eslint-disable-next-line no-undef
  saveAs(blob, `neno-${dateSuffix}.db.json`);
  return json;
};


export {
  getNote,
  getNotes,
  putNote,
  deleteNote,
  getDatabaseAsJSON,
  getGraph,
  archiveDatabase,
};

