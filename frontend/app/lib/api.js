import { API_URL } from "./config.js";
import { yyyymmdd, htmlDecode } from "./utils.js";
import { saveAs } from "file-saver";
import * as tokenManager from "./tokenManager.js";


const callAPI = async (method, endpoint, body, outputType = "json") => {
  const fetchOptions = {
    method,
    headers: {
      "Content-Type": "application/json",
      "authorization": "Bearer " + tokenManager.get(),
    },
  };

  if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(API_URL + endpoint, fetchOptions);

  let responseFormatted;

  if (outputType === "json") {
    responseFormatted = await response.json();
  } else if (outputType === "text") {
    responseFormatted = await response.text();
  } else if (outputType === "blob") {
    responseFormatted = await response.blob();
  }

  return responseFormatted;
};


const login = async (username, password) => {
  const response = await callAPI("POST", "login", { username, password });
  if (response.success) {
    tokenManager.set(response.token);
    return true;
  }

  return false;
};


const getNote = async (noteId) => {
  const response = await callAPI("GET", "note/" + noteId);
  return response.payload;
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

  return responseObject.payload;
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

  return response.payload;
};


const deleteNote = async (noteId) => {
  await callAPI("DELETE", "note/" + noteId);
};


const getStats = async () => {
  const response = await callAPI("GET", "stats");
  if (!response.success) {
    throw new Error(response.error);
  }
  return response.payload;
};


const getGraph = async () => {
  const response = await callAPI("GET", "graph");
  return response.payload;
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

  if (!response.success) {
    throw new Error("Error saving graph!");
  }

  return true;
};


const downloadDatabase = async () => {
  const jsonString = await callAPI("GET", "database", null, "text");
  const blob = new Blob([jsonString], {
    type: "application/json",
  });
  const dateSuffix = yyyymmdd(new Date());
  saveAs(blob, `neno-${dateSuffix}.db.json`);
};


const downloadDatabaseWithUploads = async () => {
  const blob = await callAPI("GET", "database-with-uploads", null, "blob");
  const dateSuffix = yyyymmdd(new Date());
  saveAs(blob, `neno-${dateSuffix}.db.zip`);
};


const importLinksAsNotes = async (links) => {
  const response = await callAPI("PUT", "import-links-as-notes", { links });

  if (response.success === false) {
    throw new Error(response.error);
  }

  return response.payload;
};


export {
  login,
  getNote,
  getNotes,
  putNote,
  deleteNote,
  getStats,
  getGraph,
  getGraphObject,
  saveGraph,
  downloadDatabase,
  downloadDatabaseWithUploads,
  importLinksAsNotes,
};

