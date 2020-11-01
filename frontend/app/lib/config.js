const DEFAULT_NOTE_TITLE = "Note title";

const placeholderNoteObject = {
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

export {
  DEFAULT_NOTE_TITLE,
  placeholderNoteObject,
  API_URL,
};
