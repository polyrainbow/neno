import * as path from "path";
import fs from "fs";
import http from "http";
import * as url from "url";
import mkdirp from "mkdirp";
import * as config from "./config.js";
import startApp from "./app.js";
import { Command } from "commander";
const program = new Command();
program.version('0.0.1');

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const REPO_PATH = path.join(__dirname, "..");

program
  .option(
    '-p, --port <value>', 'HTTP port',
    config.DEFAULT_PORT.toString(),
  )
  .option(
    '-d, --data-folder-path <value>', "path to data folder",
    path.join(REPO_PATH, "..", "network-notes-data"),
  );

program.parse(process.argv);

// passwords and usernames must not contain colons
let users;
const usersFile = path.join(program.dataFolderPath, "users.json");
if (fs.existsSync(usersFile)) {
  console.log("Loading existing users file...");
  const json = fs.readFileSync(usersFile).toString();
  users = JSON.parse(json);
} else {
  console.log(
    "No users file found. Creating one by myself with default users...",
  );
  mkdirp.sync(program.dataFolderPath);
  fs.writeFileSync(usersFile, JSON.stringify(config.DEFAULT_USERS));
  users = config.DEFAULT_USERS;
}


const app = startApp({
  users,
  dataPath: program.dataFolderPath,
  frontendPath: path.join(REPO_PATH, "frontend"),
});


const httpServer = http.createServer(app);
httpServer.listen(parseInt(program.port));
console.log("Ready on port " + program.port);




