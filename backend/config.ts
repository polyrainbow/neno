const API_PATH = "/api/";

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
  {
    id: "admin",
    login: "admin",
    // bcrypt password hash for default password 0000
    passwordHash:
      "$2a$10$dhCPi4ycActip6dS74olwed9ENrN3V7XWSjbCn7S5V0cIUjctCBm2",
  },
];

export {
  API_PATH,
  ALLOWED_IMAGE_UPLOAD_TYPES,
  ALLOWED_FILE_UPLOAD_TYPES,
  DEFAULT_USERS,
}