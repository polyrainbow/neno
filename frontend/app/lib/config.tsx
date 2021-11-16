import NoteContentBlock, {
  NoteContentBlockType,
} from "../../../lib/notes/interfaces/NoteContentBlock";

const DEFAULT_NOTE_TITLE = "";

const DEFAULT_NOTE_BLOCKS:NoteContentBlock[] = [
  {
    "type": NoteContentBlockType.HEADING,
    "data": {
      "text": DEFAULT_NOTE_TITLE,
      "level": 1,
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
  "document": "📄",
  "image": "🖼️",
  "code": "🤖",
  "audio": "🎧",
  "video": "📺",
  "pin": "📌",
  "hub": "🐙",
  "text": "✏️",
};

const ICON_PATH = "/assets/icons/";

const MAX_WIDTH_SMALL_SCREEN = 1280;

const paths = {
  editor: "/editor",
  editorWithNote: "/editor/%NOTE_ID%",
  editorWithNewNote: "/editor/new",
  list: "/list",
  graph: "/graph",
  graphWithFocusNote: "/graph?focusNote=%FOCUS_NOTE_ID%",
  login: "/login",
  stats: "/stats",
};

const SEARCH_RESULTS_PER_PAGE = 100;

const DEFAULT_DOCUMENT_TITLE = "NENO";

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
  DEFAULT_DOCUMENT_TITLE,
};
