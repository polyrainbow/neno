import { FileId } from "../../../lib/notes/interfaces/FileId";
import { PathTemplate } from "../enum/PathTemplate";
import { UnsavedActiveNote } from "../types/ActiveNote";
import * as Config from "../config";
import FrontendUserNoteChange, { FrontendUserNoteChangeNote }
  from "../types/FrontendUserNoteChange";
import { UserNoteChangeType }
  from "../../../lib/notes/interfaces/UserNoteChangeType";
import { FileInfo } from "../../../lib/notes/interfaces/FileInfo";
import DatabaseProvider from "../types/DatabaseProvider";
import {
  Block,
  BlockSlashlink,
  BlockType,
  BlockUrl,
} from "../../../lib/subwaytext/interfaces/Block";
import subwaytext from "../../../lib/subwaytext";
import { Note } from "../../../lib/notes/interfaces/Note";
import { GraphId } from "../../../lib/notes/interfaces/GraphId";


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
      return content + "/file:" + fileId + "\n\n";
    }, "")
    .trim();
};


const getNewNoteContent = (
  fileIds?: FileId[],
): string => {
  return fileIds
    ? createContentFromFileIds(fileIds)
    : Config.DEFAULT_NOTE_CONTENT;
};


const getNewNoteObject = (
  linkedNotes: FrontendUserNoteChangeNote[],
  fileIds?: FileId[],
): UnsavedActiveNote => {
  const note: UnsavedActiveNote = {
    isUnsaved: true,
    changes: linkedNotes.map(
      (note: FrontendUserNoteChangeNote): FrontendUserNoteChange => {
        return {
          type: UserNoteChangeType.LINKED_NOTE_ADDED,
          note,
          noteId: note.id,
        };
      },
    ),
    title: Config.DEFAULT_NOTE_TITLE,
    content: getNewNoteContent(fileIds),
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


const getNoteTitleFromContent = (content: string): string => {
  return shortenText(content, 100);
};


// if the note has no title yet, take the title of the link metadata
const setNoteTitleByContentIfUnset = (
  note: Note,
  defaultNoteTitle: string,
): void => {
  if (note.content.length === 0) return;

  const noteHasNoTitle = (
    note.meta.title === defaultNoteTitle
    || note.meta.title === ""
  );

  if (noteHasNoTitle) {
    const newNoteTitle = getNoteTitleFromContent(note.content);
    note.meta.title = newNoteTitle;
  }
};


/*
  @function binaryArrayFind:
    This function performs a binary search in an array of objects that is
    sorted by a specific key in the objects.

  @param sortedArray:
    An array of objects that is sorted by a specific key in the objects.
  @param sortKeyKey:
    They key of the object whose corresponding value is the sort key for
    that object.
  @param sortKeyKey:
    The sort key we want to find.
*/
const binaryArrayFind = function<T>(
  sortedArray: T[],
  sortKeyKey: string,
  sortKeyToFind: string,
): T | null {
  let start = 0;
  let end = sortedArray.length - 1;

  while (start <= end) {
    // Find the mid index
    const mid = Math.floor((start + end) / 2);

    // If element is present at mid, return it
    if (sortedArray[mid][sortKeyKey] === sortKeyToFind) {
      return sortedArray[mid];
    // Else look in left or right half accordingly
    } else if (sortedArray[mid][sortKeyKey] < sortKeyToFind) {
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }

  return null;
};


/*
  @function binaryArrayIncludes:
    This function performs a binary search in the manner of Array.includes()
    in an array of values that has been sorted with Array.sort().

  @param sortedArray:
    An array of values that is sorted with Array.sort()
  @param valueToLookFor:
    The value we want to find.
*/
const binaryArrayIncludes = function<T>(
  sortedArray: T[],
  valueToLookFor: T,
): boolean {
  let start = 0;
  let end = sortedArray.length - 1;

  while (start <= end) {
    // Find the mid index
    const mid = Math.floor((start + end) / 2);

    // If element is present at mid, we have it
    if (sortedArray[mid] === valueToLookFor) {
      return true;
    // Else look in left or right half accordingly
    } else if (sortedArray[mid] < valueToLookFor) {
      start = mid + 1;
    } else {
      end = mid - 1;
    }
  }

  return false;
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
  // eslint-disable-next-line no-undefined
  return bytes.toLocaleString(undefined, {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp,
  }) + " " + units[u];
}


const streamToBlob = async (stream, mimeType: string): Promise<Blob> => {
  const response = new Response(
    stream,
    {
      headers: { "Content-Type": mimeType },
    },
  );
  const blob = await response.blob();
  return blob;
};


const getWindowDimensions = (): {width: number, height: number} => {
  const docEl = document.documentElement;
  const width = window.innerWidth || docEl.clientWidth;
  const height = window.innerHeight || docEl.clientHeight;
  return { width, height };
};


const parseFileIds = (noteContent: string): FileId[] => {
  // eslint-disable-next-line max-len
  const regex = /\/file:([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}.[a-z0-9]{1,4})/g;
  return [...noteContent.matchAll(regex)].map((match) => match[1]);
};


const getFileId = (noteContent: string): FileId | null => {
  // eslint-disable-next-line max-len
  const regex = /file:([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}.[a-z0-9]{1,4})/g;
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
  types: FilePickerAcceptType[],
  multiple: boolean,
): Promise<File[]> => {
  const fileHandles = await window.showOpenFilePicker({
    multiple,
    types,
    excludeAcceptAllOption: false,
  });

  const files = await Promise.all(
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
  graphId: GraphId,
  file: FileInfo,
  databaseProvider: DatabaseProvider,
): Promise<void> => {
  const fileId = file.fileId;
  const name = file.name;
  const url = await databaseProvider.getUrlForFileId(graphId, fileId, name);
  window.open(url, "_blank");
};


export const getUrl = async (
  graphId: GraphId,
  file: FileInfo,
  databaseProvider: DatabaseProvider,
) => {
  const fileId = file.fileId;
  const name = file.name;
  const url = await databaseProvider.getUrlForFileId(graphId, fileId, name);
  return url;
};


// also works with utf-8/16 strings in constrast to btoa()
const base64Encode = async (string: string): Promise<string> => {
  return new Promise((resolve) => {
    const fileReader = new FileReader();

    fileReader.onload = function() {
      const result = fileReader.result as string;
      const signal = "base64,";
      const posOfSignal = result.indexOf(signal);
      const base64String = result.substring(posOfSignal + signal.length);
      resolve(base64String);
    };

    fileReader.readAsDataURL(new Blob(Array.from(string)));
  });
};


const insertDocumentTitles = async (
  noteContent: string,
  databaseProvider: DatabaseProvider,
): Promise<string> => {
  const urlsWithDocTitles = await Promise.all(
    subwaytext(noteContent)
      .filter((block: Block): block is BlockUrl => {
        return block.type === BlockType.URL
          && block.data.text.length === 0;
      })
      .map(async (block): Promise<[string, string]> => {
        const url = block.data.url;
        let documentTitle: string;
        if (typeof databaseProvider.getDocumentTitle === "function") {
          try {
            documentTitle
              = (await databaseProvider.getDocumentTitle(url)) as string;
          } catch (e) {
            documentTitle = "";
          }
        } else {
          documentTitle = "";
        }

        return [
          block.data.url,
          documentTitle,
        ];
      }),
  );

  const lines = noteContent.split("\n");

  // TODO: This method of replacing might result in incorrect notes when a URL
  // is at the beginning of a line but not part of a URL block.
  // We should instead edit the parsed note and re-serialize it again. For this
  // we need an idempotent parse/serialize mechanism.
  urlsWithDocTitles.forEach(([url, docTitle]) => {
    for (const [i, line] of lines.entries()) {
      if (line.trimEnd() === url) {
        lines[i] = url + " " + docTitle;
        break;
      }
    }
  });

  return lines.join("\n");
};


const getWritableStream = async (opts) => {
  const newHandle = await window.showSaveFilePicker(opts);
  // create a FileSystemWritableFileStream to write to
  const writableStream = await newHandle.createWritable();
  return writableStream;
};


export {
  yyyymmdd,
  getParameterByName,
  makeTimestampHumanReadable,
  getNewNoteObject,
  setNoteTitleByContentIfUnset,
  binaryArrayFind,
  binaryArrayIncludes,
  humanFileSize,
  shortenText,
  streamToBlob,
  getWindowDimensions,
  blockHasLoadedFile,
  getAppPath,
  getIconSrc,
  getNewNoteContent,
  stringContainsOnlyDigits,
  getNoteTitleFromContent,
  getFilesFromUserSelection,
  base64Encode,
  parseFileIds,
  getFileId,
  insertDocumentTitles,
  getWritableStream,
  readFileAsString,
};
