import NoteContentBlock, {
  NoteContentBlockType,
} from "../../../lib/notes/interfaces/NoteContentBlock";

const DEFAULT_NOTE_TITLE = "";

const DEFAULT_NOTE_BLOCKS:NoteContentBlock[] = [
  {
    "type": NoteContentBlockType.PARAGRAPH,
    "data": {
      "text": "",
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

// base path of the hosting environment. if you want to serve the application on
// domain.com/neno the ROOT_PATH must be set to "/neno/".
const ROOT_PATH = "/";
const ASSETS_PATH = `${ROOT_PATH}assets/`;
const ICON_PATH = `${ASSETS_PATH}icons/`;

const MAX_WIDTH_SMALL_SCREEN = 1280;

const SEARCH_RESULTS_PER_PAGE = 100;

const DEFAULT_DOCUMENT_TITLE = "NENO";

export {
  DEFAULT_NOTE_TITLE,
  DEFAULT_NOTE_BLOCKS,
  API_URL,
  texts,
  MINIMUM_SEARCH_QUERY_LENGTH,
  emojis,
  ROOT_PATH,
  ASSETS_PATH,
  ICON_PATH,
  MAX_WIDTH_SMALL_SCREEN,
  SEARCH_RESULTS_PER_PAGE,
  DEFAULT_DOCUMENT_TITLE,
};
