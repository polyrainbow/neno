import * as path from "path";
import * as url from "url";

const API_PATH = "/api/";
const USER_ENDOPINT = API_PATH + "user/";
const GRAPH_ENDPOINT = API_PATH + "graph/:graphId/";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
// since ts files will be compiled to dist/ directory, we need to go two levels
// above to arrive at the repo directory
const REPO_PATH = path.join(__dirname, "..", "..");
const SERVER_TIMEOUT = 30_000; // ms
const GRAPHS_DIRECTORY_NAME = "graphs";

const ORIGIN = "http://localhost:8080";
const RELYING_PARTY = "localhost";

export {
  API_PATH,
  USER_ENDOPINT,
  GRAPH_ENDPOINT,
  REPO_PATH,
  SERVER_TIMEOUT,
  GRAPHS_DIRECTORY_NAME,
  ORIGIN,
  RELYING_PARTY,
};