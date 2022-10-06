import { APIError } from "../../../../backend/interfaces/APIError";
import APIResponse from "../../../../backend/interfaces/APIResponse";
import { FileId } from "../../../../lib/notes/interfaces/FileId";
import { FileInfo } from "../../../../lib/notes/interfaces/FileInfo";
import { NoteId } from "../../../../lib/notes/interfaces/NoteId";
import { NoteSaveRequest }
  from "../../../../lib/notes/interfaces/NoteSaveRequest";
import NoteToTransmit from "../../../../lib/notes/interfaces/NoteToTransmit";
import { base64Encode } from "../utils";

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
  additionalHeaders?: {
    [key: string]: string,
  }
}

interface EndpointCallParams {
  method?: string,
  endpoint: string,
  payload?: any,
  outputType?: string,
  payloadType?: string,
  additionalHeaders?: {
    [key: string]: string,
  }
}

const callAPI = async ({
  method = "GET",
  url,
  payload,
  outputType = "json",
  payloadType = "application/json",
  additionalHeaders = {},
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
      ...additionalHeaders,
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
    method: "POST",
    endpoint: "authenticated",
  });
};


const getRawNote = (noteId: NoteId): Promise<string | null> => {
  return callGraphAPIAndGetJSONPayload({
    endpoint: "note-raw/" + noteId,
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


const putNote = (noteSaveRequest: NoteSaveRequest) => {
  return callGraphAPIAndGetJSONPayload({
    method: "PUT",
    endpoint: "note",
    payload: noteSaveRequest,
  });
};


const putRawNote = (rawNote: string) => {
  return callGraphAPIAndGetJSONPayload({
    method: "PUT",
    endpoint: "raw-note",
    payload: {
      note: rawNote,
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


const getFileInfo = (fileId: FileId) => {
  return callGraphAPIAndGetJSONPayload({
    endpoint: "file-info/" + fileId,
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


const uploadFile = async (file: File): Promise<FileInfo> => {
  const response = await callGraphAPIAndGetJSONPayload({
    method: "POST",
    endpoint: "file",
    payload: file,
    payloadType: "application/neno-filestream",
    additionalHeaders: {
      "filename": await base64Encode(file.name),
    },
  });

  return response;
};


const deleteFile = (fileId) => {
  return callGraphAPIAndGetJSONPayload({
    method: "DELETE",
    endpoint: "file/" + fileId,
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


const getDocumentTitle = async (url: string): Promise<string> => {
  const requestUrl = "document-title?url=" + encodeURIComponent(url);
  const response = (await callAPI({
    url: API_URL + requestUrl,
    outputType: "json",
  })) as APIResponse;

  return getJSONResponsePayloadIfSuccessful(response) as string;
};


export {
  init,
  setGraphId,
  login,
  logout,
  isAuthenticated,
  getRawNote,
  getNote,
  getNotes,
  putNote,
  putRawNote,
  deleteNote,
  getStats,
  getFiles,
  getDanglingFiles,
  getGraphVisualization,
  saveGraphVisualization,
  getReadableGraphStream,
  uploadFile,
  getReadableFileStream,
  deleteFile,
  pinNote,
  unpinNote,
  getPins,
  getFileInfo,
  getDocumentTitle,
};

