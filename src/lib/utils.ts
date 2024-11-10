import { PathTemplate } from "../types/PathTemplate";
import { UnsavedActiveNote } from "../types/ActiveNote";
import * as Config from "../config";
import CreateNewNoteParams from "../types/CreateNewNoteParams";
import { Slug } from "./notes/types/Slug";
import { sluggifyWikilinkText } from "./notes/slugUtils";


const shortenText = (text: string, maxLength: number): string => {
  if (text.length > maxLength) {
    return text.trim().substring(0, maxLength) + "…";
  } else {
    return text;
  }
};


const ISOTimestampToLocaleString = (timestamp: string): string => {
  return (new Date(timestamp)).toLocaleString();
};


const createContentFromSlugs = (
  slugs: Slug[],
): string => {
  return slugs
    .reduce((content, slug) => {
      return content + `/${slug}` + "\n\n";
    }, "")
    .trim();
};


const getNewNoteObject = (params: CreateNewNoteParams): UnsavedActiveNote => {
  const note: UnsavedActiveNote = {
    isUnsaved: true,
    initialContent: params.content ?? Config.DEFAULT_NOTE_CONTENT,
    // Note may already have files, but the files list will be populated by
    // notesProvider
    files: [],
    flags: [],
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


const getAppPath = (
  pathTemplate: PathTemplate,
  params?: Map<string, string>,
  urlParams?: URLSearchParams,
  doNotEncode?: boolean,
): string => {
  let path = `${Config.ROOT_PATH}${pathTemplate}`;

  params?.forEach((value, key) => {
    if (value.length === 0) {
      throw new Error(
        "getAppPath: Empty value for app path param received: " + key,
      );
    }
    path = path.replace(
      `%${key}%`,
      doNotEncode ? value : encodeURIComponent(value),
    );
  });

  if (urlParams && urlParams.size > 0) {
    path += "?" + urlParams;
  }

  return path;
};


const getIconSrc = (iconName: string): string => {
  if (iconName === "neno") {
    return Config.ASSETS_PATH + "app-icon/logo.svg";
  }
  return Config.ICON_PATH + iconName + ".svg";
};


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


// @ts-ignore
const getWritableStream = async (opts: SaveFilePickerOptions) => {
  // @ts-ignore
  const newHandle = await window.showSaveFilePicker(opts);
  // create a FileSystemWritableFileStream to write to
  const writableStream = await newHandle.createWritable();
  return writableStream;
};


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


const getLines = (
  text: string,
  startOffset: number,
  numberOfLines: number,
  onlyNonEmptyLines: boolean,
): string => {
  let lines = text.split("\n");

  if (onlyNonEmptyLines) {
    lines = lines.filter((line) => line.trim().length > 0);
  }

  return lines.slice(startOffset, startOffset + numberOfLines).join("\n");
};


const getWikilinkForNote = (slug: Slug, title: string): string => {
  // If the title can be sluggified to the note's slug, use the
  // title as link text, because it looks much nicer.
  const wikilinkContent = sluggifyWikilinkText(title) === slug
    ? title
    : slug.replace(/\//g, "//");

  const wikilink = `[[${wikilinkContent}]]`;
  return wikilink;
};


export {
  getPagedMatches,
  ISOTimestampToLocaleString,
  getNewNoteObject,
  humanFileSize,
  shortenText,
  streamToBlob,
  getAppPath,
  getIconSrc,
  getFilesFromUserSelection,
  getWritableStream,
  readFileAsString,
  createContentFromSlugs,
  getLines,
  getWikilinkForNote,
};
