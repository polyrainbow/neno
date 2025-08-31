import { BASE_URL, VERSION } from "./constants.js";

const DEFAULT_NOTE_CONTENT = "";

const LOCAL_GRAPH_ID = "local";

// base path of the hosting environment. if you want to serve the application on
// domain.com/neno the ROOT_PATH must be set to "/neno/".
// The base path is currently set via the vite.config.js file.
const ROOT_PATH = BASE_URL;
const ASSETS_PATH = `${ROOT_PATH}assets/`;
const ICON_PATH = `${ASSETS_PATH}icons/`;

const MAX_WIDTH_SMALL_SCREEN = 1280;

const SEARCH_RESULTS_PER_PAGE = 50;

const DEFAULT_DOCUMENT_TITLE = "NENO";

// @ts-ignore
const FILE_PICKER_ACCEPT_TYPES: FilePickerAcceptType[] = [
  {
    description: "Media file",
    accept: {
      "audio/*": [".mp3", ".flac", ".m4a"],
      "video/*": [".mp4", ".webm"],
      "application/*": [".pdf", ".js"],
      "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"],
    },
  },
];

const SPAN_SEPARATOR = " · ";

const NOTE_FILE_EXTENSION = ".subtext";

const NOTE_MIME_TYPE = "text/subtext";

const NOTE_FILE_DESCRIPTION = "NENO subtext note";

const DEFAULT_FILE_SLUG_FOLDER = "files";

const NENO_SCRIPT_FILE_SUFFIX = ".neno.js";

export {
  VERSION,
  DEFAULT_NOTE_CONTENT,
  ROOT_PATH,
  ASSETS_PATH,
  ICON_PATH,
  MAX_WIDTH_SMALL_SCREEN,
  SEARCH_RESULTS_PER_PAGE,
  DEFAULT_DOCUMENT_TITLE,
  FILE_PICKER_ACCEPT_TYPES,
  SPAN_SEPARATOR,
  LOCAL_GRAPH_ID,
  NOTE_FILE_EXTENSION,
  NOTE_MIME_TYPE,
  NOTE_FILE_DESCRIPTION,
  DEFAULT_FILE_SLUG_FOLDER,
  NENO_SCRIPT_FILE_SUFFIX,
};
