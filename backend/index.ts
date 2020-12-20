import * as path from "path";
import fs from "fs";
import http from "http";
import https from "https";
import * as url from "url";
import mkdirp from "mkdirp";
import * as config from "./config.js";
import startApp from "./app.js";
import getProgramArguments from "./getProgramArguments.js";
import User from "./interfaces/User.js";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const REPO_PATH = path.join(__dirname, "..");
const VERSION = "1.0.0";
const program = getProgramArguments(VERSION);

// passwords and usernames must not contain colons
let users:User[];
const usersFile = path.join(program.dataFolderPath, "users.json");
if (fs.existsSync(usersFile)) {
  console.log("Loading existing users file...");
  const json = fs.readFileSync(usersFile).toString();
  users = JSON.parse(json);

  const isValid = users.every((user) => {
    return typeof user.id === "string"
      && typeof user.login === "string"
      && typeof user.passwordHash === "string";
  });

  if (!isValid) {
    console.error("User file is not valid. Please make sure that every user "
      + "has a valid id, login and passwordHash. Terminating!");
    process.exit(1);
  }
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
  jwtSecret: program.jwtSecret,
});


if (program.useHttps) {
  const httpsServer = https.createServer(
    {
      key: fs.readFileSync(program.certKeyPath),
      cert: fs.readFileSync(program.certPath)
    },
    app,
  );

  httpsServer.listen(parseInt(program.httpsPort));

  console.log("HTTPS access ready on port " + program.httpsPort);
  
  if (program.port == "80" && program.httpsPort == "443") {
    // redirect http requests to https
    http.createServer(function (req, res) {
      res.writeHead(301, {
        "Location": "https://" + req.headers['host'] + req.url,
      });
      res.end();
    }).listen(program.port);

    console.log(
      "HTTP requests to port " + program.port + " will be redirected to HTTPS.",
    );
  }
} else {
  const httpServer = http.createServer(app);
  httpServer.listen(parseInt(program.port));

  console.log("HTTP access ready on port " + program.port);
}


