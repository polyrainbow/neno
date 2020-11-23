import { API_URL } from "./config.js";
import { yyyymmdd } from "./utils.js";
import { saveAs } from "file-saver";

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

  const responseObject = await response.json();

  if (!responseObject.success) {
    throw new Error("Server says this was unsuccessful");
  }

  return responseObject.notes;
};


const putNote = async (note, options) => {
  const response = await fetch(API_URL + "note", {
    method: "PUT",
    body: JSON.stringify({
      note,
      options,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await response.json();

  if (json.success === false) {
    throw new Error(json.error);
  }

  return json.note;
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
  saveAs(blob, `neno-${dateSuffix}.db.json`);
  return json;
};


const importLinksAsNotes = async (links) => {
  const response = await fetch(API_URL + "import-links-as-notes", {
    method: "PUT",
    body: JSON.stringify({
      links,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const json = await response.json();

  if (json.success === false) {
    throw new Error(json.error);
  }

  return json.note;
};


export {
  getNote,
  getNotes,
  putNote,
  deleteNote,
  getDatabaseAsJSON,
  getGraph,
  archiveDatabase,
  importLinksAsNotes,
};

