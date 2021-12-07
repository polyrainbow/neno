let API_URL;

const setAPIUrl = (_API_URL) => {
  API_URL = _API_URL;
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

  const response = await fetch(API_URL + url, fetchOptions);

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
    url: "login",
    body: { username, password, mfaToken },
  });
};


const logout = () => {
  return callAPIAndGetJSONPayload({
    method: "POST",
    url: "logout",
  });
};


const isAuthenticated = () => {
  return callAPIAndGetJSONPayload({
    url: "authenticated",
  });
};


const getNote = (noteId) => {
  return callAPIAndGetJSONPayload({
    url: "note/" + noteId,
  });
};


const getNotes = (options) => {
  const params = new URLSearchParams(options);
  const url = `notes?${params.toString()}`;

  return callAPIAndGetJSONPayload({
    url,
  });
};


const putNote = (note, options) => {
  return callAPIAndGetJSONPayload({
    method: "PUT",
    url: "note",
    body: {
      note,
      options,
    },
  });
};


const deleteNote = (noteId) => {
  return callAPIAndGetJSONPayload({
    method: "DELETE",
    url: "note/" + noteId,
  });
};


const getStats = (options) => {
  const searchParams = new URLSearchParams(options);
  const url = "stats?" + searchParams.toString();

  return callAPIAndGetJSONPayload({
    url,
  });
};


const getGraph = () => {
  return callAPIAndGetJSONPayload({
    url: "graph",
  });
};


const saveGraph = (graphObject) => {
  return callAPIAndGetJSONPayload({
    method: "POST",
    url: "graph",
    body: graphObject,
  });
};


const getReadableDatabaseStream = async (withUploads) => {
  const url = "database?withUploads=" + withUploads.toString();
  const response = await callAPI({
    url,
    outputType: "body",
  });
  return response;
};


const getReadableFileStream = async (fileId) => {
  const url = "file/" + fileId;
  const response = await callAPI({
    url,
    outputType: "body",
  });
  return response;
};


const importLinksAsNotes = (links) => {
  return callAPIAndGetJSONPayload({
    method: "PUT",
    url: "import-links-as-notes",
    body: { links },
  });
};


const uploadFile = (file) => {
  return callAPIAndGetJSONPayload({
    method: "POST",
    url: "file",
    body: file,
    bodyType: file.type,
  });
};


const uploadFileByUrl = (data) => {
  return callAPIAndGetJSONPayload({
    method: "POST",
    url: "file-by-url",
    body: data,
  });
};


const getUrlMetadata = (url) => {
  const requestUrl = "url-metadata?url=" + url;
  return callAPIAndGetJSONPayload({
    url: requestUrl,
  });
};


const pinNote = (noteId) => {
  return callAPIAndGetJSONPayload({
    method: "PUT",
    url: "pins",
    body: { noteId },
  });
};


const unpinNote = (noteId) => {
  return callAPIAndGetJSONPayload({
    method: "DELETE",
    url: "pins",
    body: { noteId },
  });
};


const getPins = () => {
  return callAPIAndGetJSONPayload({
    url: "pins",
  });
};


export {
  setAPIUrl,
  login,
  logout,
  isAuthenticated,
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

