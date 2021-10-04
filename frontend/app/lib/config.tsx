const DEFAULT_NOTE_TITLE = "Note title";

const DEFAULT_NOTE_BLOCKS = [
  {
    "type": "header",
    "data": {
      "text": DEFAULT_NOTE_TITLE,
      "level": 1,
    },
  },
  {
    "type": "paragraph",
    "data": {
      "text": "Note text",
    },
  },
  {
    "type": "linkTool",
    "data": {
      "link": "",
      "meta": {},
    },
  },
];

const API_URL = "/api/";

const texts = {
  titleAlreadyExistsConfirmation:
    "A note with this title already exists. Do you want to save this note "
    + "with the same title?",
  discardChangesConfirmation:
    "There are unsaved changes. Do you really want to discard them? "
    + "If not, click cancel and save them first.",
};

const MINIMUM_SEARCH_QUERY_LENGTH = 3;

const emojis = {
  "note": "📝",
  "link": "🔗",
  "unlinked": "🔴",
  "new": "🆕",
  "unsavedChanges": "✳️",
  "noUnsavedChanges": "✔️",
  "weblink": "🌍",
  "file": "📎",
  "image": "🖼️",
  "code": "🤖",
  "audio": "🎧",
  "pin": "📌",
  "hub": "🐙",
  "text": "✏️",
};

const ICON_PATH = "/assets/icons/";

const MAX_WIDTH_SMALL_SCREEN = 1200;

const paths = {
  editor: "/editor",
  editorWithNote: "/editor/%NOTE_ID%",
  newNote: "/editor/new",
  list: "/list",
  graph: "/graph",
  graphWithFocusNote: "/graph?focusNote=%FOCUS_NOTE_ID%",
  login: "/login",
};

const SEARCH_RESULTS_PER_PAGE = 100;

export {
  DEFAULT_NOTE_TITLE,
  DEFAULT_NOTE_BLOCKS,
  API_URL,
  texts,
  MINIMUM_SEARCH_QUERY_LENGTH,
  emojis,
  ICON_PATH,
  MAX_WIDTH_SMALL_SCREEN,
  paths,
  SEARCH_RESULTS_PER_PAGE,
};
