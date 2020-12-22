import { API_URL } from "./config.js";
import { htmlDecode } from "./utils.js";
import * as tokenManager from "./tokenManager.js";


const callAPI = async (
  method,
  endpoint,
  body,
  outputType = "json",
  bodyType = "json",
) => {
  const fetchOptions = {
    method,
    headers: {
      "authorization": "Bearer " + tokenManager.get(),
    },
  };

  // do NOT set content-type header if content is form data
  // https://stackoverflow.com/a/39281156/3890888
  if (bodyType === "json") {
    fetchOptions.headers["Content-Type"] = "application/json";
  }

  if (body) {
    fetchOptions.body
      = bodyType === "json" ? JSON.stringify(body) : body;
  }

  const response = await fetch(API_URL + endpoint, fetchOptions);

  let responseFormatted;

  if (outputType === "json") {
    responseFormatted = await response.json();
  } else if (outputType === "text") {
    responseFormatted = await response.text();
  } else if (outputType === "blob") {
    responseFormatted = await response.blob();
  } else if (outputType === "body") {
    responseFormatted = response.body;
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
  const page = options?.page || 1;
  const sortMode = options?.sortMode;

  let url = "notes?page=" + page.toString() + "&sortMode=" + sortMode;

  if (typeof query === "string") {
    url = url
      + "&q=" + encodeURIComponent(query)
      + "&caseSensitive=" + caseSensitive;
  }

  const response = await callAPI("GET", url);
  if (!response.success) {
    throw new Error(response.error);
  }
  return response.payload;
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


const getReadableDatabaseStream = async (withUploads) => {
  const apiEndpoint = "database?withUploads=" + withUploads.toString();
  const response = await callAPI("GET", apiEndpoint, null, "body");
  return response;
};


const importLinksAsNotes = async (links) => {
  const response = await callAPI("PUT", "import-links-as-notes", { links });

  if (response.success === false) {
    throw new Error(response.error);
  }

  return response.payload;
};


const uploadFile = async (file) => {
  const data = new FormData();
  data.append("file", file);
  const response = await callAPI(
    "POST", "file", data, "json", "form-data",
  );

  if (!response.success) {
    throw new Error(response.error);
  }

  return response.payload;
};


const fetchURLMetadata = async (url) => {
  const requestUrl = "link-data?url=" + url;
  const response = await callAPI("GET", requestUrl, null, "json");
  return response;
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
  getReadableDatabaseStream,
  importLinksAsNotes,
  uploadFile,
  fetchURLMetadata,
};

