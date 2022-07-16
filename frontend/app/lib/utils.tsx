import { FileId } from "../../../lib/notes/interfaces/FileId";
import NoteContentBlock, {
  NoteContentBlockLink,
  NoteContentBlockType,
  NoteContentBlockWithFile,
  NoteContentBlockWithFileLoaded,
} from "../../../lib/notes/interfaces/NoteContentBlock";
import { PathTemplate } from "../enum/PathTemplate";
import { SavedActiveNote, UnsavedActiveNote } from "../interfaces/ActiveNote";
import * as Config from "../config";
import NoteFromUser from "../../../lib/notes/interfaces/NoteFromUser";
import { FileInfo } from "../../../lib/notes/interfaces/FileInfo";


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


const getExtensionFromFilename = (filename: string): string | null => {
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
  filename: string,
): NoteContentBlockType | null => {
  const map = new Map<string, NoteContentBlockType>(Object.entries({
    "png": NoteContentBlockType.IMAGE,
    "jpg": NoteContentBlockType.IMAGE,
    "webp": NoteContentBlockType.IMAGE,
    "gif": NoteContentBlockType.IMAGE,
    "svg": NoteContentBlockType.IMAGE,
    "pdf": NoteContentBlockType.DOCUMENT,
    "mp3": NoteContentBlockType.AUDIO,
    "flac": NoteContentBlockType.AUDIO,
    "mp4": NoteContentBlockType.VIDEO,
    "webm": NoteContentBlockType.VIDEO,
  }));

  const extension = getExtensionFromFilename(filename);
  if (!extension) {
    return null;
  }

  return map.has(extension) ? map.get(extension) as NoteContentBlockType : null;
};


const createBlocksFromFileIds = (
  fileIds: FileId[],
): NoteContentBlockWithFile[] => {
  return fileIds.map((fileId: FileId): NoteContentBlockWithFile => {
    const type = getFileTypeFromFilename(fileId) as NoteContentBlockType;

    return {
      // @ts-ignore
      type,
      data: {
        file: {
          fileId,
          name: fileId,
          /*
            TODO: use real size from server
            size must not be NaN, because when stringified, it becomes null
            which is invalid
          */
          size: -1,
        },
      },
    };
  });
};


const getNewNoteBlocks = (
  fileIds?: FileId[],
): NoteContentBlock[] => {
  return fileIds
    ? createBlocksFromFileIds(fileIds)
    : Config.DEFAULT_NOTE_BLOCKS;
};


const getNewNoteObject = (): UnsavedActiveNote => {
  const note: UnsavedActiveNote = {
    isUnsaved: true,
    changes: [],
    title: Config.DEFAULT_NOTE_TITLE,
  };

  Object.seal(note);
  return note;
};


// if the note has no title yet, take the title of the link metadata
const setNoteTitleByLinkTitleIfUnset = (
  note: NoteFromUser,
  defaultNoteTitle: string,
): void => {
  if (note.blocks.length === 0) return;

  const firstLinkBlock = note.blocks.find(
    (block: NoteContentBlock): block is NoteContentBlockLink => {
      return block.type === "link";
    },
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


const shortenText = (text: string, maxLength: number): string => {
  if (text.length > maxLength) {
    return text.trim().substring(0, maxLength) + "…";
  } else {
    return text;
  }
};


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


/**
 * Checks if the block contains a valid file.
 * @param {NoteContentBlock} block
 * @return {boolean} true or false
 */
const blockHasLoadedFile = (
  block: NoteContentBlock,
): block is NoteContentBlockWithFileLoaded => {
  return (
    [
      "image",
      "document",
      "audio",
      "video",
    ].includes(block.type)
    && (typeof (block as NoteContentBlockWithFile).data.file === "object")
  );
};


const getMetadataOfFilesInNote = (
  note: SavedActiveNote,
): FileInfo[] => {
  return note.blocks
    .filter(blockHasLoadedFile)
    .map(
      (block: NoteContentBlockWithFileLoaded): FileInfo => {
        return block.data.file;
      },
    );
};


const getAppPath = (
  pathTemplate: PathTemplate,
  params?: Map<string, string>,
  urlParams?: URLSearchParams,
): string => {
  let path = `${Config.ROOT_PATH}${pathTemplate}`;
  params?.forEach((value, key) => {
    path = path.replace(`%${key}%`, value);
  });
  if (urlParams) {
    path += "?" + urlParams;
  }
  return path;
};


const getIconSrc = (iconName: string): string => {
  return Config.ICON_PATH + iconName + ".svg";
};

const stringContainsOnlyDigits = (val: string): boolean => /^\d+$/.test(val);


export {
  yyyymmdd,
  getParameterByName,
  makeTimestampHumanReadable,
  getNewNoteObject,
  getNewNoteBlocks,
  setNoteTitleByLinkTitleIfUnset,
  binaryArrayFind,
  binaryArrayIncludes,
  humanFileSize,
  shortenText,
  streamToBlob,
  getWindowDimensions,
  blockHasLoadedFile,
  getMetadataOfFilesInNote,
  getAppPath,
  getIconSrc,
  getFileTypeFromFilename,
  stringContainsOnlyDigits,
  getExtensionFromFilename,
};
