import { APIError } from "../../../../backend/interfaces/APIError";
import APIResponse from "../../../../backend/interfaces/APIResponse";
import { GraphId } from "../../../../lib/notes/interfaces/GraphId";
import { FileId } from "../../../../lib/notes/interfaces/FileId";
import { FileInfo } from "../../../../lib/notes/interfaces/FileInfo";
import { NoteId } from "../../../../lib/notes/interfaces/NoteId";
import { NoteSaveRequest }
  from "../../../../lib/notes/interfaces/NoteSaveRequest";
import NoteToTransmit from "../../../../lib/notes/interfaces/NoteToTransmit";
import { base64Encode } from "../utils";
import { RegisterRequestOptions } from "../../types/DatabaseProvider";

let API_URL;
let USER_ENDPOINT;

const init = (apiUrl) => {
  API_URL = apiUrl;
  USER_ENDPOINT = API_URL + "user/";
};


const getGraphEndpoint = (graphId: GraphId) => {
  return API_URL + "graph/" + graphId + "/";
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
  graphId: GraphId,
): Promise<any> => {
  const response = await callAPI({
    ...options,
    url: getGraphEndpoint(graphId) + options.endpoint,
  }) as APIResponse;
  return getJSONResponsePayloadIfSuccessful(response);
};


const login = (
  options,
): Promise<any> => {
  return callUserAPIAndGetJSONPayload({
    method: "POST",
    endpoint: "login",
    payload: options,
  });
};


const register = (
  options: RegisterRequestOptions,
): Promise<any> => {
  return callUserAPIAndGetJSONPayload({
    method: "POST",
    endpoint: "register",
    payload: options,
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


const getRawNote = (graphId, noteId: NoteId): Promise<string | null> => {
  return callGraphAPIAndGetJSONPayload({
    endpoint: "note-raw/" + noteId,
  }, graphId);
};


const getNote = (
  graphId: GraphId,
  noteId: NoteId | "random",
): Promise<NoteToTransmit | null> => {
  return callGraphAPIAndGetJSONPayload({
    endpoint: "note/" + noteId,
  }, graphId);
};


const getNotes = (graphId, options) => {
  const params = new URLSearchParams(options);
  const endpoint = `notes?${params.toString()}`;

  return callGraphAPIAndGetJSONPayload({
    endpoint,
  }, graphId);
};


const putNote = (graphId, noteSaveRequest: NoteSaveRequest) => {
  return callGraphAPIAndGetJSONPayload({
    method: "PUT",
    endpoint: "note",
    payload: noteSaveRequest,
  }, graphId);
};


const putRawNote = (graphId, rawNote: string) => {
  return callGraphAPIAndGetJSONPayload({
    method: "PUT",
    endpoint: "raw-note",
    payload: {
      note: rawNote,
    },
  }, graphId);
};


const deleteNote = (graphId, noteId) => {
  return callGraphAPIAndGetJSONPayload({
    method: "DELETE",
    endpoint: "note/" + noteId,
  }, graphId);
};


const getStats = (graphId, options) => {
  const searchParams = new URLSearchParams(options);
  const endpoint = "stats?" + searchParams.toString();

  return callGraphAPIAndGetJSONPayload({
    endpoint,
  }, graphId);
};


const getFiles = (graphId) => {
  return callGraphAPIAndGetJSONPayload({
    endpoint: "files",
  }, graphId);
};


const getFileInfo = (graphId, fileId: FileId) => {
  return callGraphAPIAndGetJSONPayload({
    endpoint: "file-info/" + fileId,
  }, graphId);
};


const getDanglingFiles = (graphId) => {
  return callGraphAPIAndGetJSONPayload({
    endpoint: "dangling-files",
  }, graphId);
};


const getGraphVisualization = (graphId) => {
  return callGraphAPIAndGetJSONPayload({
    endpoint: "graph-visualization",
  }, graphId);
};


const saveGraphVisualization = (graphId, graphObject) => {
  return callGraphAPIAndGetJSONPayload({
    method: "POST",
    endpoint: "graph-visualization",
    payload: graphObject,
  }, graphId);
};


const getReadableGraphStream = async (graphId, withFiles) => {
  const searchParams = new URLSearchParams({
    withFiles,
  });
  const url = getGraphEndpoint(graphId) + "?" + searchParams.toString();
  const response = await callAPI({
    url,
    outputType: "body",
  });
  return response;
};


const getReadableFileStream = async (graphId, fileId) => {
  const url = getGraphEndpoint(graphId) + "file/" + fileId;
  const response = await callAPI({
    url,
    outputType: "body",
  });
  return response;
};


const uploadFile = async (graphId, file: File): Promise<FileInfo> => {
  const response = await callGraphAPIAndGetJSONPayload({
    method: "POST",
    endpoint: "file",
    payload: file,
    payloadType: "application/neno-filestream",
    additionalHeaders: {
      "filename": await base64Encode(file.name),
    },
  }, graphId);

  return response;
};


const deleteFile = (graphId, fileId) => {
  return callGraphAPIAndGetJSONPayload({
    method: "DELETE",
    endpoint: "file/" + fileId,
  }, graphId);
};


const pinNote = (graphId, noteId) => {
  return callGraphAPIAndGetJSONPayload({
    method: "PUT",
    endpoint: "pins",
    payload: { noteId },
  }, graphId);
};


const unpinNote = (graphId, noteId) => {
  return callGraphAPIAndGetJSONPayload({
    method: "DELETE",
    endpoint: "pins",
    payload: { noteId },
  }, graphId);
};


const getPins = (graphId) => {
  return callGraphAPIAndGetJSONPayload({
    endpoint: "pins",
  }, graphId);
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
  login,
  register,
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

