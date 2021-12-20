let API_URL;
let GRAPH_ID;
let GRAPH_ENDPOINT;
let USER_ENDPOINT;

const init = (apiUrl) => {
  API_URL = apiUrl;
  USER_ENDPOINT = API_URL + "user/";
};


const setGraphId = (graphId) => {
  GRAPH_ID = graphId;
  GRAPH_ENDPOINT = API_URL + "graph/" + GRAPH_ID + "/";
};


const callAPI = async ({
  method = "GET",
  url,
  body,
  outputType = "json",
  bodyType = "application/json",
}) => {
  const fetchOptions = {
    method,
    headers: {
      "Content-Type": bodyType,
    },
  };

  if (body) {
    fetchOptions.body
      = bodyType === "application/json" ? JSON.stringify(body) : body;
  }

  const response = await fetch(url, fetchOptions);

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


const getJSONResponsePayloadIfSuccessful = (response) => {
  if (!response.success) {
    throw new Error(response.error);
  }

  return response.payload;
};


const callUserAPIAndGetJSONPayload = async (options) => {
  const response = await callAPI({
    ...options,
    url: USER_ENDPOINT + options.url,
  });
  return getJSONResponsePayloadIfSuccessful(response);
};


const callGraphAPIAndGetJSONPayload = async (options) => {
  const response = await callAPI({
    ...options,
    url: GRAPH_ENDPOINT + options.url,
  });
  return getJSONResponsePayloadIfSuccessful(response);
};


const login = (username, password, mfaToken) => {
  return callUserAPIAndGetJSONPayload({
    method: "POST",
    url: "login",
    body: { username, password, mfaToken },
  });
};


const logout = () => {
  return callUserAPIAndGetJSONPayload({
    method: "POST",
    url: "logout",
  });
};


const isAuthenticated = () => {
  return callUserAPIAndGetJSONPayload({
    url: "authenticated",
  });
};


const getNote = (noteId) => {
  return callGraphAPIAndGetJSONPayload({
    url: "note/" + noteId,
  });
};


const getNotes = (options) => {
  const params = new URLSearchParams(options);
  const url = `notes?${params.toString()}`;

  return callGraphAPIAndGetJSONPayload({
    url,
  });
};


const putNote = (note, options) => {
  return callGraphAPIAndGetJSONPayload({
    method: "PUT",
    url: "note",
    body: {
      note,
      options,
    },
  });
};


const deleteNote = (noteId) => {
  return callGraphAPIAndGetJSONPayload({
    method: "DELETE",
    url: "note/" + noteId,
  });
};


const getStats = (options) => {
  const searchParams = new URLSearchParams(options);
  const url = "stats?" + searchParams.toString();

  return callGraphAPIAndGetJSONPayload({
    url,
  });
};


const getFiles = () => {
  return callGraphAPIAndGetJSONPayload({
    url: "files",
  });
};


const getGraphVisualization = () => {
  return callGraphAPIAndGetJSONPayload({
    url: "graph-visualization",
  });
};


const saveGraphVisualization = (graphObject) => {
  return callGraphAPIAndGetJSONPayload({
    method: "POST",
    url: "graph-visualization",
    body: graphObject,
  });
};


const getReadableGraphStream = async (withFiles) => {
  const searchParams = new URLSearchParams({
    withFiles,
  });
  const url = GRAPH_ENDPOINT + "?" + searchParams.toString();
  const response = await callAPI({
    url,
    outputType: "body",
  });
  return response;
};


const getReadableFileStream = async (fileId) => {
  const url = GRAPH_ENDPOINT + "file/" + fileId;
  const response = await callAPI({
    url,
    outputType: "body",
  });
  return response;
};


const importLinksAsNotes = (links) => {
  return callGraphAPIAndGetJSONPayload({
    method: "PUT",
    url: "import-links-as-notes",
    body: { links },
  });
};


const uploadFile = (file) => {
  return callGraphAPIAndGetJSONPayload({
    method: "POST",
    url: "file",
    body: file,
    bodyType: file.type,
  });
};


const uploadFileByUrl = (data) => {
  return callGraphAPIAndGetJSONPayload({
    method: "POST",
    url: "file-by-url",
    body: data,
  });
};


const getUrlMetadata = (url) => {
  const requestUrl = "url-metadata?url=" + url;
  return callGraphAPIAndGetJSONPayload({
    url: requestUrl,
  });
};


const pinNote = (noteId) => {
  return callGraphAPIAndGetJSONPayload({
    method: "PUT",
    url: "pins",
    body: { noteId },
  });
};


const unpinNote = (noteId) => {
  return callGraphAPIAndGetJSONPayload({
    method: "DELETE",
    url: "pins",
    body: { noteId },
  });
};


const getPins = () => {
  return callGraphAPIAndGetJSONPayload({
    url: "pins",
  });
};


export {
  init,
  setGraphId,
  login,
  logout,
  isAuthenticated,
  getNote,
  getNotes,
  putNote,
  deleteNote,
  getStats,
  getFiles,
  getGraphVisualization,
  saveGraphVisualization,
  getReadableGraphStream,
  importLinksAsNotes,
  uploadFile,
  uploadFileByUrl,
  getReadableFileStream,
  getUrlMetadata,
  pinNote,
  unpinNote,
  getPins,
};

