import * as path from "path";
import * as url from "url";

const API_PATH = "/api/";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
// since ts files will be compiled to dist/ directory, we need to go two levels
// above to arrive at the repo directory
const REPO_PATH = path.join(__dirname, "..", "..");

export {
  API_PATH,
  REPO_PATH,
}