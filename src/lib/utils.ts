import { PathTemplate } from "../types/PathTemplate";
import ActiveNote, { UnsavedActiveNote } from "../types/ActiveNote";
import * as Config from "../config";
import { FileInfo } from "./notes/types/FileInfo";
import CreateNewNoteParams from "../types/CreateNewNoteParams";
import { getUrlForSlug } from "./LocalDataStorage";
import { Slug } from "./notes/types/Slug";
import { inferNoteTitle } from "./notes/noteUtils";
import { sluggify } from "./notes/slugUtils";


const shortenText = (text: string, maxLength: number): string => {
  if (text.length > maxLength) {
    return text.trim().substring(0, maxLength) + "…";
  } else {
    return text;
  }
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


const getAppPath = (
  pathTemplate: PathTemplate,
  params?: Map<string, string>,
  urlParams?: URLSearchParams,
  doNotEncode?: boolean,
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
    path = path.replace(
      `%${key}%`,
      doNotEncode ? value : encodeURIComponent(value),
    );
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


const getUrl = async (
  file: FileInfo,
) => {
  const slug = file.slug;
  const url = await getUrlForSlug(slug);
  return url;
};


// @ts-ignore
const getWritableStream = async (opts: SaveFilePickerOptions) => {
  // @ts-ignore
  const newHandle = await window.showSaveFilePicker(opts);
  // create a FileSystemWritableFileStream to write to
  const writableStream = await newHandle.createWritable();
  return writableStream;
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


const getNoteTitleFromActiveNote = (activeNote: ActiveNote): string => {
  return activeNote.keyValues.find((kv) => kv[0] === "title")?.[1]
    ?? inferNoteTitle(activeNote.initialContent);
};


const getWikilinkForNote = (slug: Slug, title: string): string => {
  // If the title can be sluggified to the note's slug, use the
  // title as link text, because it looks much nicer.
  const wikilinkContent = sluggify(title) === slug
    ? title
    : slug;

  const wikilink = `[[${wikilinkContent}]]`;
  return wikilink;
};


export {
  isNotEmpty,
  isNotFalse,
  getPagedMatches,
  getParameterByName,
  makeTimestampHumanReadable,
  getNewNoteObject,
  humanFileSize,
  shortenText,
  streamToBlob,
  getWindowDimensions,
  getAppPath,
  getIconSrc,
  stringContainsOnlyDigits,
  getFilesFromUserSelection,
  getWritableStream,
  readFileAsString,
  createContentFromSlugs,
  getLines,
  getWikilinkForNote,
  getNoteTitleFromActiveNote,
  getUrl,
};
