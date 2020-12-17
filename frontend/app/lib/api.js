import { API_URL } from "./config.js";
import { yyyymmdd, htmlDecode } from "./utils.js";
import { saveAs } from "file-saver";
import { get as getToken } from "./tokenManager.js"; 


const callAPI = async (method, endpoint, body, outputType = "json") => {
  const fetchOptions = {
    method,
    headers: {
      "Content-Type": "application/json",
      "authorization": getToken(),
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
  }
  
  return responseFormatted;
};


const login = async (username, password) => {
  await callAPI("POST", "login", { username, password });
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
  const jsonString = await callAPI("GET", "database", null, "text");
  return jsonString;
};


const getStats = async () => {
  const response = await callAPI("GET", "stats");
  return response;
};


const getGraph = async () => {
  const response = await callAPI("GET", "graph");
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
  login,
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

