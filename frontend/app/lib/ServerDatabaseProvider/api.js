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
    headers: {},
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


const callAPIAndGetJSONPayload = async (options) => {
  const response = await callAPI(options);
  return getJSONResponsePayloadIfSuccessful(response);
};


const login = (username, password, mfaToken) => {
  return callAPIAndGetJSONPayload({
    method: "POST",
    endpoint: "login",
    body: { username, password, mfaToken },
  });
};


const getNote = (noteId) => {
  return callAPIAndGetJSONPayload({
    endpoint: "note/" + noteId,
  });
};


const getNotes = (options) => {
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

  return callAPIAndGetJSONPayload({
    endpoint: url,
  });
};


const putNote = (note, options) => {
  return callAPIAndGetJSONPayload({
    method: "PUT",
    endpoint: "note",
    body: {
      note,
      options,
    },
  });
};


const deleteNote = (noteId) => {
  return callAPIAndGetJSONPayload({
    method: "DELETE",
    endpoint: "note/" + noteId,
  });
};


const getStats = (exhaustive) => {
  return callAPIAndGetJSONPayload({
    endpoint: "stats?exhaustive=" + exhaustive.toString(),
  });
};


const getGraph = () => {
  return callAPIAndGetJSONPayload({
    endpoint: "graph",
  });
};


const saveGraph = (graphObject) => {
  return callAPIAndGetJSONPayload({
    method: "POST",
    endpoint: "graph",
    body: graphObject,
  });
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


const importLinksAsNotes = (links) => {
  return callAPIAndGetJSONPayload({
    method: "PUT",
    endpoint: "import-links-as-notes",
    body: { links },
  });
};


const uploadFile = (file) => {
  const data = new FormData();
  data.append("file", file);
  return callAPIAndGetJSONPayload({
    method: "POST",
    endpoint: "file",
    body: data,
    bodyType: "form-data",
  });
};


const uploadFileByUrl = (data) => {
  return callAPIAndGetJSONPayload({
    method: "POST",
    endpoint: "file-by-url",
    body: data,
  });
};


const getUrlMetadata = (url) => {
  const requestUrl = "url-metadata?url=" + url;
  return callAPIAndGetJSONPayload({
    endpoint: requestUrl,
  });
};


const pinNote = (noteId) => {
  return callAPIAndGetJSONPayload({
    method: "PUT",
    endpoint: "pins",
    body: { noteId },
  });
};


const unpinNote = (noteId) => {
  return callAPIAndGetJSONPayload({
    method: "DELETE",
    endpoint: "pins",
    body: { noteId },
  });
};


const getPins = () => {
  return callAPIAndGetJSONPayload({
    endpoint: "pins",
  });
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

