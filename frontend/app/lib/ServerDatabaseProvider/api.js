import * as tokenManager from "./tokenManager.js";

let API_URL;

const setAPIUrl = (_API_URL) => {
  API_URL = _API_URL;
};


const callAPI = async ({
  method = "GET",
  endpoint,
  body,
  outputType = "json",
  bodyType = "json",
}) => {
  const fetchOptions = {
    method,
    headers: {
      "authorization": "Bearer " + tokenManager.get().token,
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


const getJSONResponsePayloadIfSuccessful = (response) => {
  if (!response.success) {
    throw new Error(response.error);
  }

  return response.payload;
};


const login = async (username, password) => {
  const response = await callAPI({
    method: "POST",
    endpoint: "login",
    body: { username, password },
  });
  return getJSONResponsePayloadIfSuccessful(response);
};


const getNote = async (noteId) => {
  const response = await callAPI({
    endpoint: "note/" + noteId,
  });
  return getJSONResponsePayloadIfSuccessful(response);
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

  const response = await callAPI({
    endpoint: url,
  });
  return getJSONResponsePayloadIfSuccessful(response);
};


const putNote = async (note, options) => {
  const response = await callAPI({
    method: "PUT",
    endpoint: "note",
    body: {
      note,
      options,
    },
  });
  return getJSONResponsePayloadIfSuccessful(response);
};


const deleteNote = async (noteId) => {
  const response = await callAPI({
    method: "DELETE",
    endpoint: "note/" + noteId,
  });
  return getJSONResponsePayloadIfSuccessful(response);
};


const getStats = async (exhaustive) => {
  const response = await callAPI({
    endpoint: "stats?exhaustive=" + exhaustive.toString(),
  });
  return getJSONResponsePayloadIfSuccessful(response);
};


const getGraph = async () => {
  const response = await callAPI({
    endpoint: "graph",
  });
  return getJSONResponsePayloadIfSuccessful(response);
};


const saveGraph = async (graphObject) => {
  const response = await callAPI({
    method: "POST",
    endpoint: "graph",
    body: graphObject,
  });
  return getJSONResponsePayloadIfSuccessful(response);
};


const getReadableDatabaseStream = async (withUploads) => {
  const apiEndpoint = "database?withUploads=" + withUploads.toString();
  const response = await callAPI({
    endpoint: apiEndpoint,
    outputType: "body",
  });
  return response;
};


const getReadableFileStream = async (fileId) => {
  const apiEndpoint = "file/" + fileId;
  const response = await callAPI({
    endpoint: apiEndpoint,
    outputType: "body",
  });
  return response;
};


const importLinksAsNotes = async (links) => {
  const response = await callAPI({
    method: "PUT",
    endpoint: "import-links-as-notes",
    body: { links },
  });
  return getJSONResponsePayloadIfSuccessful(response);
};


const uploadFile = async (file) => {
  const data = new FormData();
  data.append("file", file);
  const response = await callAPI({
    method: "POST",
    endpoint: "file",
    body: data,
    bodyType: "form-data",
  });
  return getJSONResponsePayloadIfSuccessful(response);
};


const uploadFileByUrl = async (data) => {
  const response = await callAPI({
    method: "POST",
    endpoint: "file-by-url",
    body: data,
  });
  return getJSONResponsePayloadIfSuccessful(response);
};


const getUrlMetadata = async (url) => {
  const requestUrl = "url-metadata?url=" + url;
  const response = await callAPI({
    endpoint: requestUrl,
  });
  return getJSONResponsePayloadIfSuccessful(response);
};


const pinNote = async (noteId) => {
  const response = await callAPI({
    method: "PUT",
    endpoint: "pins",
    body: { noteId },
  });
  return getJSONResponsePayloadIfSuccessful(response);
};


const unpinNote = async (noteId) => {
  const response = await callAPI({
    method: "DELETE",
    endpoint: "pins",
    body: { noteId },
  });
  return getJSONResponsePayloadIfSuccessful(response);
};


const getPins = async () => {
  const response = await callAPI({
    endpoint: "pins",
  });
  return getJSONResponsePayloadIfSuccessful(response);
};


export {
  setAPIUrl,
  login,
  getNote,
  getNotes,
  putNote,
  deleteNote,
  getStats,
  getGraph,
  saveGraph,
  getReadableDatabaseStream,
  importLinksAsNotes,
  uploadFile,
  uploadFileByUrl,
  getReadableFileStream,
  getUrlMetadata,
  pinNote,
  unpinNote,
  getPins,
};

