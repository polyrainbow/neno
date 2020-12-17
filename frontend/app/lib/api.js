import { API_URL } from "./config.js";
import { yyyymmdd, htmlDecode } from "./utils.js";
import { saveAs } from "file-saver";


const callAPI = async (method, endpoint, body) => {
  const response = await fetch(API_URL + endpoint, {
    method,
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const responseObject = await response.json();
  return responseObject;
};


const getNote = async (noteId) => {
  const note = await callAPI("GET", "note/" + noteId);
  return note;
};


const getNotes = async (options) => {
  const query = options?.query;
  const caseSensitive = options?.caseSensitive;

  let url = "notes";
  if (typeof query === "string") {
    url = url
      + "?q=" + encodeURIComponent(query)
      + "&caseSensitive=" + caseSensitive;
  }

  const responseObject = await callAPI("GET", url);

  if (!responseObject.success) {
    throw new Error("Server says this was unsuccessful");
  }

  return responseObject.notes;
};


const putNote = async (note, options) => {
  const response = await callAPI("PUT", "note",
    {
      note,
      options,
    },
  );

  if (response.success === false) {
    throw new Error(response.error);
  }

  return response.note;
};


const deleteNote = async (noteId) => {
  await callAPI("DELETE", "note/" + noteId);
};


const getDatabaseAsJSON = async () => {
  const response = await callAPI("GET", "database");
  const jsonString = JSON.stringify(response);
  return jsonString;
};


const getStats = async () => {
  const response = await fetch("GET", "stats");
  return response;
};


const getGraph = async () => {
  const response = await fetch("GET", "graph");
  return response;
};


const getGraphObject = async () => {
  // initial node data
  const graph = await getGraph();

  graph.nodes = graph.nodes.map((node) => {
    node.title = htmlDecode(node.title);
    return node;
  });

  graph.links = graph.links.map((link) => {
    return {
      source: graph.nodes.find((node) => node.id === link[0]),
      target: graph.nodes.find((node) => node.id === link[1]),
    };
  });

  return graph;
};


const saveGraph = async (graphObject) => {
  const response = await callAPI("POST", "graph", graphObject);

  if (!response.success === true) {
    throw new Error("Error saving graph!");
  }

  return true;
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


const archiveDatabaseWithUploads = async () => {
  const a = document.createElement("a");
  a.href = API_URL + "database-with-uploads";
  a.download = true;
  a.click();
};


const importLinksAsNotes = async (links) => {
  const response = await callAPI("PUT", "import-links-as-notes", links);

  if (response.success === false) {
    throw new Error(response.error);
  }

  return response.note;
};


export {
  getNote,
  getNotes,
  putNote,
  deleteNote,
  getDatabaseAsJSON,
  getStats,
  getGraph,
  getGraphObject,
  saveGraph,
  archiveDatabase,
  archiveDatabaseWithUploads,
  importLinksAsNotes,
};

