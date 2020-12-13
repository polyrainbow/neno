const DEFAULT_PORT = 8080;

const API_PATH = "/api";

const ALLOWED_IMAGE_UPLOAD_TYPES = [
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
];


const ALLOWED_FILE_UPLOAD_TYPES = [
  {
    mimeType: "application/pdf",
    ending: "pdf",
  },
];

const DEFAULT_USERS = [
  { id: "admin", login: "admin", password: "0000" },
];

export {
  DEFAULT_PORT,
  API_PATH,
  ALLOWED_IMAGE_UPLOAD_TYPES,
  ALLOWED_FILE_UPLOAD_TYPES,
  DEFAULT_USERS,
}