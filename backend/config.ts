import * as path from "path";
import * as url from "url";

const API_PATH = "/api/";

// in days
const MAX_SESSION_AGE = 30;

// in bytes
const MAX_UPLOAD_FILE_SIZE = 524_288_000; // 500 MB

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
// since ts files will be compiled to dist/ directory, we need to go two levels
// above to arrive at the repo directory
const REPO_PATH = path.join(__dirname, "..", "..");

export {
  API_PATH,
  MAX_SESSION_AGE,
  MAX_UPLOAD_FILE_SIZE,
  REPO_PATH,
}