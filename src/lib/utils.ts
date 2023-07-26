import { FileId } from "./notes/interfaces/FileId";
import { PathTemplate } from "../enum/PathTemplate";
import { UnsavedActiveNote } from "../types/ActiveNote";
import * as Config from "../config";
import { FileInfo } from "./notes/interfaces/FileInfo";
import {
  Block,
  BlockSlashlink,
  BlockType,
} from "./subwaytext/interfaces/Block.js";
import CreateNewNoteParams from "../types/CreateNewNoteParams";
import { FILE_SLUG_PREFIX } from "./notes/config.js";
import { getUrlForFileId } from "./LocalDataStorage";


const shortenText = (text: string, maxLength: number): string => {
  if (text.length > maxLength) {
    return text.trim().substring(0, maxLength) + "…";
  } else {
    return text;
  }
};


const yyyymmdd = (date = new Date()): string => {
  const yyyy = date.getFullYear().toString();
  const mm = (date.getMonth() + 1).toString(); // getMonth() is zero-based
  const dd = date.getDate().toString();
  return (
    yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0])
  );
};


const getParameterByName = (name: string, url: string): string | null => {
  if (!url) url = window.location.href;
  name = name.replace(/[[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};


const makeTimestampHumanReadable = (timestamp: number): string => {
  return (new Date(timestamp)).toLocaleString();
};


const createContentFromFileIds = (
  fileIds: FileId[],
): string => {
  return fileIds
    .reduce((content, fileId) => {
      return content + `/${FILE_SLUG_PREFIX}${fileId}` + "\n\n";
    }, "")
    .trim();
};


const getNewNoteObject = (params: CreateNewNoteParams): UnsavedActiveNote => {
  const note: UnsavedActiveNote = {
    isUnsaved: true,
    content: params.content ?? Config.DEFAULT_NOTE_CONTENT,
    initialContent: params.content ?? "",
    // Note may already have files, but the files list will be populated by
    // databaseProvider
    files: [],
    keyValues: [],
    flags: [],
    contentType: Config.DEFAULT_CONTENT_TYPE,
  };

  Object.seal(note);
  return note;
};


function humanFileSize(bytes: number, si = false, dp = 1): string {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + " B";
  }

  const units = si
    ? ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    : ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (
    Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1
  );


  // https://stackoverflow.com/a/39686116/3890888

  return bytes.toLocaleString(undefined, {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  }) + " " + units[u];
}


const streamToBlob = async (
  stream: ReadableStream,
  mimeType: string,
): Promise<Blob> => {
  const response = new Response(
    stream,
    {
      headers: { "Content-Type": mimeType },
    },
  );
  const blob = await response.blob();
  return blob;
};


const getWindowDimensions = (): { width: number, height: number } => {
  const docEl = document.documentElement;
  const width = window.innerWidth || docEl.clientWidth;
  const height = window.innerHeight || docEl.clientHeight;
  return { width, height };
};


const parseFileIds = (noteContent: string): FileId[] => {
  // eslint-disable-next-line max-len
  const regex = /\/files\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}.[a-z0-9]{1,4})/g;
  return [...noteContent.matchAll(regex)].map((match) => match[1]);
};


const getFileId = (noteContent: string): FileId | null => {
  // eslint-disable-next-line max-len
  const regex = /files\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}.[a-z0-9]{1,4})/g;
  const results = [...noteContent.matchAll(regex)].map((match) => match[1]);
  if (results.length > 0) {
    return results[0];
  } else {
    return null;
  }
};


const blockHasLoadedFile = (
  block: Block,
): block is BlockSlashlink => {
  if (
    block.type !== BlockType.SLASHLINK) return false;

  return !!parseFileIds(block.data.link)[0];
};


const getAppPath = (
  pathTemplate: PathTemplate,
  params?: Map<string, string>,
  urlParams?: URLSearchParams,
): string => {
  // We don't use ROOT_PATH here because it is automatically used by the router
  // via its `basename` property
  let path = `/${pathTemplate}`;
  params?.forEach((value, key) => {
    if (value.length === 0) {
      throw new Error(
        "getAppPath: Empty value for app path param received: " + key,
      );
    }
    path = path.replace(`%${key}%`, value);
  });

  if (path.includes("%")) {
    throw new Error(
      "getAppPath: Invalid path. Did you forget to set a param? " + path,
    );
  }

  if (urlParams) {
    path += "?" + urlParams;
  }

  return path;
};


const getIconSrc = (iconName: string): string => {
  return Config.ICON_PATH + iconName + ".svg";
};


const stringContainsOnlyDigits = (val: string): boolean => /^\d+$/.test(val);


const getFilesFromUserSelection = async (
  // @ts-ignore
  types: FilePickerAcceptType[],
  multiple: boolean,
): Promise<File[]> => {
  // @ts-ignore
  const fileHandles = await window.showOpenFilePicker({
    multiple,
    types,
    excludeAcceptAllOption: false,
  });

  const files = await Promise.all(
    // @ts-ignore
    fileHandles.map((fileHandle) => fileHandle.getFile()),
  );

  return files;
};


const readFileAsString = async (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const fileReader = new FileReader();

    fileReader.onload = function() {
      const result = fileReader.result as string;
      resolve(result);
    };

    fileReader.readAsText(file);
  });
};


export const onDownload = async (
  file: FileInfo,
): Promise<void> => {
  const fileId = file.fileId;
  const url = await getUrlForFileId(fileId);
  window.open(url, "_blank");
};


export const getUrl = async (
  file: FileInfo,
) => {
  const fileId = file.fileId;
  const url = await getUrlForFileId(fileId);
  return url;
};


// also works with utf-8/16 strings in constrast to btoa()
const base64Encode = async (
  input: string | Blob | ArrayBuffer,
): Promise<string> => {
  return new Promise((resolve) => {
    const fileReader = new FileReader();

    fileReader.onload = function() {
      const result = fileReader.result as string;
      const signal = "base64,";
      const posOfSignal = result.indexOf(signal);
      const base64String = result.substring(posOfSignal + signal.length);
      resolve(base64String);
    };

    const blob = typeof input === "string"
      ? new Blob(Array.from(input))
      : ("size" in input)
        ? input
        : new Blob([new Uint8Array(input, 0, input.byteLength)]);

    fileReader.readAsDataURL(blob);
  });
};


const base64UrlEncode = async (
  input: string | Blob | ArrayBuffer,
) => {
  const base64 = await base64Encode(input);
  let base64Url = base64;
  while (base64Url[base64Url.length - 1] === "=") {
    base64Url = base64Url.substring(0, base64Url.length - 1);
  }
  base64Url = base64Url
    .replace(/\+/g, "-")
    .replace(/\//g, "_");

  return base64Url;
};


const base64UrlDecode = function(input: string): string {
  // Replace non-url compatible chars with base64 standard chars
  input = input
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  // Pad out with standard base64 required padding characters
  const pad = input.length % 4;
  if (pad) {
    if (pad === 1) {
      throw new Error(
        "InvalidLengthError: Input base64url string is the wrong length to "
        + "determine padding",
      );
    }
    input += new Array(5 - pad).join("=");
  }

  return input;
};


const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

const base64UrlToArrayBuffer = (input: string): ArrayBuffer => {
  return base64ToArrayBuffer(base64UrlDecode(input));
};


const stringToUTF8ByteArray = (input: string): Uint8Array => {
  const enc = new TextEncoder(); // always utf-8
  return enc.encode(input);
};


// @ts-ignore
const getWritableStream = async (opts: SaveFilePickerOptions) => {
  // @ts-ignore
  const newHandle = await window.showSaveFilePicker(opts);
  // create a FileSystemWritableFileStream to write to
  const writableStream = await newHandle.createWritable();
  return writableStream;
};

const getKeySortFunction = function(
  key: string | number,
  doCaseInsensitiveSort: boolean,
): (a: any, b: any) => number {
  return function(a, b): number {
    let x = a[key];
    let y = b[key];

    if (doCaseInsensitiveSort && (typeof x === "string")) {
      x = x.toLowerCase();
      y = y.toLowerCase();
    }

    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  };
};


const deepFreeze = (o: any) => {
  Object.freeze(o);
  if (o === undefined) {
    return o;
  }

  Object.getOwnPropertyNames(o).forEach(function(prop) {
    if (o[prop] !== null
    && (typeof o[prop] === "object" || typeof o[prop] === "function")
    && !Object.isFrozen(o[prop])) {
      deepFreeze(o[prop]);
    }
  });

  return o;
};


function isNotEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}


function isNotFalse<TValue>(value: TValue | false): value is TValue {
  return value !== false;
}


const getPagedMatches = <T>(
  allMatches: Array<T>,
  page: number,
  rows: number,
): Array<T> => {
  const startIndex = (page - 1) * rows;

  if (allMatches.length < startIndex) {
    return [];
  } else {
    const allMatchesFromThisPageOn = allMatches.slice(startIndex);

    if (allMatchesFromThisPageOn.length > rows) {
      return allMatches.slice(startIndex, startIndex + rows);
    } else {
      return allMatchesFromThisPageOn;
    }
  }
};


const stringContainsUUID = (string: string): boolean => {
  return Array.isArray(
    string.match(
      /\b[0-9a-f]{8}\b-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-\b[0-9a-f]{12}\b/g,
    ),
  );
};


const getFirstLines = (text: string, numberOfLines: number): string => {
  const lines = text.split("\n");
  return lines.slice(0, numberOfLines).join("\n");
};


export {
  getKeySortFunction,
  yyyymmdd,
  deepFreeze,
  isNotEmpty,
  isNotFalse,
  getPagedMatches,
  stringContainsUUID,
  getParameterByName,
  makeTimestampHumanReadable,
  getNewNoteObject,
  humanFileSize,
  shortenText,
  streamToBlob,
  getWindowDimensions,
  blockHasLoadedFile,
  getAppPath,
  getIconSrc,
  stringContainsOnlyDigits,
  getFilesFromUserSelection,
  base64Encode,
  base64UrlEncode,
  base64UrlToArrayBuffer,
  parseFileIds,
  getFileId,
  getWritableStream,
  readFileAsString,
  stringToUTF8ByteArray,
  createContentFromFileIds,
  getFirstLines,
};
