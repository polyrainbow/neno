import { ContentMode } from "./types/ContentMode.js";

const VERSION = "v6.1.0";

const DEFAULT_NOTE_CONTENT = "";

const MINIMUM_SEARCH_QUERY_LENGTH = 3;

const LOCAL_GRAPH_ID = "local";

const emojis = {
  "note": "📝",
  "link": "🔗",
  "unlinked": "🔴",
  "new": "🆕",
  "unsavedChanges": "✳️",
  "noUnsavedChanges": "✔️",
  "weblink": "🌍",
  "file": "📎",
  "document": "📄",
  "image": "🖼️",
  "code": "🤖",
  "audio": "🎧",
  "video": "📺",
  "pin": "📌",
  "hub": "🐙",
  "text": "✏️",
};

// base path of the hosting environment. if you want to serve the application on
// domain.com/neno the ROOT_PATH must be set to "/neno/".
const ROOT_PATH = "/";
const ASSETS_PATH = `${ROOT_PATH}assets/`;
const ICON_PATH = `${ASSETS_PATH}icons/`;

const MAX_WIDTH_SMALL_SCREEN = 1280;

const SEARCH_RESULTS_PER_PAGE = 50;

const DEFAULT_DOCUMENT_TITLE = "NENO";

// disable this if you want to build a local-only instance
const SERVER_DATABASE_ENABLED = true;

// @ts-ignore
const FILE_PICKER_ACCEPT_TYPES: FilePickerAcceptType[] = [
  {
    description: "Media file",
    accept: {
      "audio/*": [".mp3", ".flac"],
      "video/*": [".mp4", ".webm"],
      "application/*": [".pdf", ".js"],
      "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"],
    },
  },
];

const DEFAULT_CONTENT_MODE = ContentMode.EDITOR;

const SPAN_SEPARATOR = " · ";

const NOTE_FILE_EXTENSION = ".subtext";

const NOTE_MIME_TYPE = "text/subtext";

const DEFAULT_CONTENT_TYPE = NOTE_MIME_TYPE;

const NOTE_FILE_DESCRIPTION = "NENO subtext note";

export {
  VERSION,
  DEFAULT_NOTE_CONTENT,
  MINIMUM_SEARCH_QUERY_LENGTH,
  emojis,
  ROOT_PATH,
  ASSETS_PATH,
  ICON_PATH,
  MAX_WIDTH_SMALL_SCREEN,
  SEARCH_RESULTS_PER_PAGE,
  DEFAULT_DOCUMENT_TITLE,
  SERVER_DATABASE_ENABLED,
  FILE_PICKER_ACCEPT_TYPES,
  DEFAULT_CONTENT_TYPE,
  DEFAULT_CONTENT_MODE,
  SPAN_SEPARATOR,
  LOCAL_GRAPH_ID,
  NOTE_FILE_EXTENSION,
  NOTE_MIME_TYPE,
  NOTE_FILE_DESCRIPTION,
};
