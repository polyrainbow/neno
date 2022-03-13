import { FileId } from "../../../lib/notes/interfaces/FileId";
import {
  NoteContentBlockType,
  NoteContentBlockWithFile,
} from "../../../lib/notes/interfaces/NoteContentBlock";
import { PathTemplate } from "../enum/PathTemplate";
import ActiveNote from "../interfaces/ActiveNote";
import * as Config from "./config";


const yyyymmdd = (date = new Date()) => {
  const yyyy = date.getFullYear().toString();
  const mm = (date.getMonth() + 1).toString(); // getMonth() is zero-based
  const dd = date.getDate().toString();
  return (
    yyyy + "-" + (mm[1] ? mm : "0" + mm[0]) + "-" + (dd[1] ? dd : "0" + dd[0])
  );
};


const getParameterByName = (name, url) => {
  if (!url) url = window.location.href;
  name = name.replace(/[[\]]/g, "\\$&");
  const regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)");
  const results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
};


const makeTimestampHumanReadable = (timestamp) => {
  return (new Date(timestamp)).toLocaleString();
};


const getExtensionFromFilename = (filename: string):string | null => {
  const posOfDot = filename.lastIndexOf(".");
  if (posOfDot === -1) {
    return null;
  }

  const extension = filename.substring(posOfDot + 1);
  if (extension.length === 0) {
    return null;
  }

  return extension;
};


const getFileTypeFromFilename = (
  filename:string,
):NoteContentBlockType | null => {
  const map = new Map<string, NoteContentBlockType>(Object.entries({
    "png": NoteContentBlockType.IMAGE,
    "jpg": NoteContentBlockType.IMAGE,
    "webp": NoteContentBlockType.IMAGE,
    "gif": NoteContentBlockType.IMAGE,
    "svg": NoteContentBlockType.IMAGE,
    "pdf": NoteContentBlockType.DOCUMENT,
    "mp3": NoteContentBlockType.AUDIO,
    "mp4": NoteContentBlockType.VIDEO,
    "webm": NoteContentBlockType.VIDEO,
  }));

  const extension = getExtensionFromFilename(filename);
  if (!extension) {
    return null;
  }

  return map.has(extension) ? map.get(extension) as NoteContentBlockType : null;
};


const getBlocksWithFileIds = (
  fileIds: FileId[],
):NoteContentBlockWithFile[] => {
  return fileIds.map((fileId:FileId):NoteContentBlockWithFile => {
    const type = getFileTypeFromFilename(fileId) as NoteContentBlockType;

    return {
      // @ts-ignore
      type,
      data: {
        file: {
          extension: getExtensionFromFilename(fileId) as string,
          fileId,
          name: fileId,
          size: NaN,
        },
      },
    };
  });
};


const getNewNoteObject = (
  fileIds?: FileId[],
):ActiveNote => {
  const blocks = fileIds
    ? getBlocksWithFileIds(fileIds)
    : Config.DEFAULT_NOTE_BLOCKS;

  const note:ActiveNote = {
    changes: [],
    blocks,
    id: NaN,
    isUnsaved: true,
    linkedNotes: [],
    title: Config.DEFAULT_NOTE_TITLE,
  };

  Object.seal(note);
  return note;
};


// if the note has no title yet, take the title of the link metadata
const setNoteTitleByLinkTitleIfUnset = (note, defaultNoteTitle) => {
  if (note.blocks.length === 0) return;

  const firstLinkBlock = note.blocks.find(
    (block) => block.type === "link",
  );

  if (!firstLinkBlock) return;

  const linkBlockHasValidTitle
    = typeof firstLinkBlock.data.meta.title === "string"
    && firstLinkBlock.data.meta.title.length > 0;

  if (!linkBlockHasValidTitle) return;

  const noteHasNoTitle = (
    note.title === defaultNoteTitle
    || note.title === ""
  );

  if (noteHasNoTitle && linkBlockHasValidTitle) {
    const newNoteTitle = firstLinkBlock.data.meta.title;
    note.title = newNoteTitle;
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
const binaryArrayFind = function(sortedArray, sortKeyKey, sortKeyToFind) {
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
const binaryArrayIncludes = function(sortedArray, valueToLookFor):boolean {
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


const shortenText = (text:string, maxLength:number) => {
  if (text.length > maxLength) {
    return text.trim().substring(0, maxLength) + "…";
  } else {
    return text;
  }
};


const streamToBlob = async (stream, mimeType) => {
  const response = new Response(
    stream,
    {
      headers: { "Content-Type": mimeType },
    },
  );
  const blob = await response.blob();
  return blob;
};


const getWindowDimensions = () => {
  const docEl = document.documentElement;
  const width = window.innerWidth || docEl.clientWidth;
  const height = window.innerHeight || docEl.clientHeight;
  return { width, height };
};


/**
 * Checks if the block contains a valid file.
 * @param {NoteContentBlock} block
 * @return {boolean} true or false
 */
const blockHasFile = (block) => {
  return (
    [
      "image",
      "document",
      "audio",
      "video",
    ].includes(block.type)
    && (typeof block.data.file.fileId === "string")
  );
};


const getFileInfosOfNoteFiles = (note) => {
  return note.blocks
    .filter(blockHasFile)
    .map((block) => {
      return {
        type: block.type,
        fileId: block.data.file.fileId,
        name: block.data.file.name,
      };
    });
};


const getAppPath = (
  pathTemplate:PathTemplate,
  params?:Map<string, string>,
  urlParams?: URLSearchParams,
):string => {
  let path = `${Config.ROOT_PATH}${pathTemplate}`;
  params?.forEach((value, key) => {
    path = path.replace(`%${key}%`, value);
  });
  if (urlParams) {
    path += "?" + urlParams;
  }
  return path;
};


const getIconSrc = (iconName) => {
  return Config.ICON_PATH + iconName + "_black_24dp.svg";
};


export {
  yyyymmdd,
  getParameterByName,
  makeTimestampHumanReadable,
  getNewNoteObject,
  setNoteTitleByLinkTitleIfUnset,
  binaryArrayFind,
  binaryArrayIncludes,
  humanFileSize,
  shortenText,
  streamToBlob,
  getWindowDimensions,
  blockHasFile,
  getFileInfosOfNoteFiles,
  getAppPath,
  getIconSrc,
  getFileTypeFromFilename,
};
