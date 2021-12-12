const ALLOWED_FILE_TYPES = [
  {
    mimeType: "image/png",
    ending: "png",
  },
  {
    mimeType: "image/jpeg",
    ending: "jpg",
  },
  {
    mimeType: "image/webp",
    ending: "webp",
  },
  {
    mimeType: "image/gif",
    ending: "gif",
  },
  {
    mimeType: "image/svg+xml",
    ending: "svg",
  },
  {
    mimeType: "application/pdf",
    ending: "pdf",
  },
  {
    mimeType: "audio/mp3",
    ending: "mp3",
  },
  {
    mimeType: "audio/mpeg",
    ending: "mp3",
  },
  {
    mimeType: "video/mp4",
    ending: "mp4",
  },
  {
    mimeType: "video/webm",
    ending: "webm",
  },
];

const NUMBER_OF_RESULTS_PER_NOTE_LIST_PAGE = 100;

const MIN_NUMBER_OF_LINKS_FOR_HUB = 5;

const NOTE_TITLE_PLACEHOLDER = "⁉️ Untitled note";

export {
  ALLOWED_FILE_TYPES,
  NUMBER_OF_RESULTS_PER_NOTE_LIST_PAGE,
  MIN_NUMBER_OF_LINKS_FOR_HUB,
  NOTE_TITLE_PLACEHOLDER,
}