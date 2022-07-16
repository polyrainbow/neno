import { APIError } from "../../../../backend/interfaces/APIError";
import APIResponse from "../../../../backend/interfaces/APIResponse";
import NoteFromUser from "../../../../lib/notes/interfaces/NoteFromUser";
import { NoteId } from "../../../../lib/notes/interfaces/NoteId";
import NoteToTransmit from "../../../../lib/notes/interfaces/NoteToTransmit";

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

interface APICallParams {
  method?: string,
  url: string,
  payload?: any, // can be string or file object
  outputType?: string,
  payloadType?: string, // the MIME type of the request body payload
}

interface EndpointCallParams {
  method?: string,
  endpoint: string,
  payload?: any,
  outputType?: string,
  payloadType?: string,
}

const callAPI = async ({
  method = "GET",
  url,
  payload,
  outputType = "json",
  payloadType = "application/json",
}: APICallParams): Promise<Blob | string | ReadableStream | APIResponse> => {
  const requestBody
    = payload && (
      payloadType === "application/json"
        ? JSON.stringify(payload)
        : payload
    );

  const fetchOptions = {
    method,
    headers: {
      "Content-Type": payloadType,
    },
    body: requestBody,
  };

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


const getJSONResponsePayloadIfSuccessful = (
  responseObject: APIResponse,
): any => {
  if (!responseObject.success) {
    // if this is an error from the notes module, forward its message
    // if not, just output the error from the API.
    const errorMessage
      = responseObject.error === APIError.NOTES_APPLICATION_ERROR
        ? responseObject.errorMessage
        : responseObject.error;
    throw new Error(errorMessage);
  }

  return responseObject.payload;
};


const callUserAPIAndGetJSONPayload = async (
  options: EndpointCallParams,
): Promise<any> => {
  const response = await callAPI({
    ...options,
    url: USER_ENDPOINT + options.endpoint,
  }) as APIResponse;
  return getJSONResponsePayloadIfSuccessful(response);
};


const callGraphAPIAndGetJSONPayload = async (
  options: EndpointCallParams,
): Promise<any> => {
  const response = await callAPI({
    ...options,
    url: GRAPH_ENDPOINT + options.endpoint,
  }) as APIResponse;
  return getJSONResponsePayloadIfSuccessful(response);
};


const login = (
  username: string,
  password: string,
  mfaToken: string,
): Promise<any> => {
  return callUserAPIAndGetJSONPayload({
    method: "POST",
    endpoint: "login",
    payload: { username, password, mfaToken },
  });
};


const logout = () => {
  return callUserAPIAndGetJSONPayload({
    method: "POST",
    endpoint: "logout",
  });
};


const isAuthenticated = () => {
  return callUserAPIAndGetJSONPayload({
    endpoint: "authenticated",
  });
};


const getNote = (noteId: NoteId): Promise<NoteToTransmit | null> => {
  return callGraphAPIAndGetJSONPayload({
    endpoint: "note/" + noteId,
  });
};


const getNotes = (options) => {
  const params = new URLSearchParams(options);
  const endpoint = `notes?${params.toString()}`;

  return callGraphAPIAndGetJSONPayload({
    endpoint,
  });
};


const putNote = (note: NoteFromUser, options) => {
  return callGraphAPIAndGetJSONPayload({
    method: "PUT",
    endpoint: "note",
    payload: {
      note,
      options,
    },
  });
};


const deleteNote = (noteId) => {
  return callGraphAPIAndGetJSONPayload({
    method: "DELETE",
    endpoint: "note/" + noteId,
  });
};


const getStats = (options) => {
  const searchParams = new URLSearchParams(options);
  const endpoint = "stats?" + searchParams.toString();

  return callGraphAPIAndGetJSONPayload({
    endpoint,
  });
};


const getFiles = () => {
  return callGraphAPIAndGetJSONPayload({
    endpoint: "files",
  });
};


const getDanglingFiles = () => {
  return callGraphAPIAndGetJSONPayload({
    endpoint: "dangling-files",
  });
};


const getGraphVisualization = () => {
  return callGraphAPIAndGetJSONPayload({
    endpoint: "graph-visualization",
  });
};


const saveGraphVisualization = (graphObject) => {
  return callGraphAPIAndGetJSONPayload({
    method: "POST",
    endpoint: "graph-visualization",
    payload: graphObject,
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
    endpoint: "import-links-as-notes",
    payload: { links },
  });
};


const uploadFile = (file) => {
  return callGraphAPIAndGetJSONPayload({
    method: "POST",
    endpoint: "file",
    payload: file,
    payloadType: file.type,
  });
};


const deleteFile = (fileId) => {
  return callGraphAPIAndGetJSONPayload({
    method: "DELETE",
    endpoint: "file/" + fileId,
  });
};


const getUrlMetadata = (url) => {
  const requestUrl = "url-metadata?url=" + url;
  return callGraphAPIAndGetJSONPayload({
    endpoint: requestUrl,
  });
};


const pinNote = (noteId) => {
  return callGraphAPIAndGetJSONPayload({
    method: "PUT",
    endpoint: "pins",
    payload: { noteId },
  });
};


const unpinNote = (noteId) => {
  return callGraphAPIAndGetJSONPayload({
    method: "DELETE",
    endpoint: "pins",
    payload: { noteId },
  });
};


const getPins = () => {
  return callGraphAPIAndGetJSONPayload({
    endpoint: "pins",
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
  getDanglingFiles,
  getGraphVisualization,
  saveGraphVisualization,
  getReadableGraphStream,
  importLinksAsNotes,
  uploadFile,
  getReadableFileStream,
  deleteFile,
  getUrlMetadata,
  pinNote,
  unpinNote,
  getPins,
};

