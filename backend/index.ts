import * as path from "path";
import fs from "fs";
import http from "http";
import https from "https";
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
    '-p, --port <value>',
    'HTTP port',
    "80",
  )
  .option(
    '--https-port <value>',
    'HTTPS port',
    "443",
  )
  .option(
    '-d, --data-folder-path <value>',
    "path to data folder",
    path.join(REPO_PATH, "..", "network-notes-data"),
  )
  .option(
    '--use-https',
    "create a https server (valid cert and key must be passed as parameters)",
    false,
  )
  .option(
    '--cert-path <value>',
    "path to TLS certificate",
    path.join(REPO_PATH, "..", "server.cert"),
  )
  .option(
    '--cert-key-path <value>',
    "path to private key of TLS certificate",
    path.join(REPO_PATH, "..", "server.key"),
  )

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
}


