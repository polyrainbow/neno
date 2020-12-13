import * as path from "path";
import fs from "fs";
import http from "http";
import * as url from "url";
import mkdirp from "mkdirp";
import * as config from "./config.js";
import startApp from "./app.js";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

let PORT = config.DEFAULT_PORT;
const REPO_PATH = path.join(__dirname, "..");
let DATA_PATH = path.join(REPO_PATH, "..", "network-notes-data");
if (process.env.DATA_FOLDER_PATH) {
  DATA_PATH = process.env.DATA_FOLDER_PATH;
}

// passwords and usernames must not contain colons
let users;
const usersFile = path.join(DATA_PATH, "users.json");
if (fs.existsSync(usersFile)) {
  console.log("Loading existing users file...");
  const json = fs.readFileSync(usersFile).toString();
  users = JSON.parse(json);
} else {
  console.log(
    "No users file found. Creating one by myself with default users...",
  );
  mkdirp.sync(DATA_PATH);
  fs.writeFileSync(usersFile, JSON.stringify(config.DEFAULT_USERS));
  users = config.DEFAULT_USERS;
}


const customPortArgument = process.argv.find((arg) => {
  return arg.startsWith("port=");
});

if (customPortArgument) {
  PORT = parseInt(customPortArgument.substring(5));
}

const app = startApp({
  users,
  dataPath: DATA_PATH,
  frontendPath: path.join(REPO_PATH, "frontend"),
});

const httpServer = http.createServer(app);
httpServer.listen(PORT);
console.log("Ready on port " + PORT);




