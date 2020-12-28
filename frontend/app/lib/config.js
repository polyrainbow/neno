const DEFAULT_NOTE_TITLE = "Note title";

const newEditorDataObject = {
  "time": 1582493003964,
  "blocks": [
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
  ],
  "version": "2.16.1",
};

const API_URL = "/api/";

const texts = {
  titleAlreadyExistsConfirmation:
    "A note with this title already exists. Do you want to save this note "
    + "with the same title?",
  discardChangesConfirmation:
    "There are unsaved changes. Do you really want to discard them "
    + "and load another note?",
  discardGraphChangesConfirmation:
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
};

// session token expire time in seconds
const MAX_SESSION_AGE = 60 * 60 * 24 * 30; // 30 days

export {
  DEFAULT_NOTE_TITLE,
  newEditorDataObject,
  API_URL,
  texts,
  MINIMUM_SEARCH_QUERY_LENGTH,
  emojis,
  MAX_SESSION_AGE,
};
