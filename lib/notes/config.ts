import FileType from "./interfaces/FileType";

const ALLOWED_FILE_TYPES:FileType[] = [
  {
    mimeType: "image/png",
    extension: "png",
  },
  {
    mimeType: "image/jpeg",
    extension: "jpg",
  },
  {
    mimeType: "image/webp",
    extension: "webp",
  },
  {
    mimeType: "image/gif",
    extension: "gif",
  },
  {
    mimeType: "image/svg+xml",
    extension: "svg",
  },
  {
    mimeType: "application/pdf",
    extension: "pdf",
  },
  {
    mimeType: "audio/mp3",
    extension: "mp3",
  },
  {
    mimeType: "audio/mpeg",
    extension: "mp3",
  },
  {
    mimeType: "video/mp4",
    extension: "mp4",
  },
  {
    mimeType: "video/webm",
    extension: "webm",
  },
];

const NUMBER_OF_RESULTS_PER_NOTE_LIST_PAGE = 100;

const MIN_NUMBER_OF_LINKS_FOR_HUB = 5;

const NOTE_TITLE_PLACEHOLDER = "Untitled note";

export {
  ALLOWED_FILE_TYPES,
  NUMBER_OF_RESULTS_PER_NOTE_LIST_PAGE,
  MIN_NUMBER_OF_LINKS_FOR_HUB,
  NOTE_TITLE_PLACEHOLDER,
}