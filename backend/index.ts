import * as path from "path";
import fs from "fs";
import http, { RequestListener } from "http";
import https from "https";
import * as url from "url";
import startApp from "./app.js";
import getProgramArguments from "./getProgramArguments.js";
import User from "./interfaces/User.js";
import getUsers from "./users.js";
import { getUrlMetadata } from "./lib/notes/index.js";


const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const REPO_PATH = path.join(__dirname, "..");
const VERSION = "1.0.0";
const program = getProgramArguments(VERSION);

if (program.urlMetadata.length > 0) {
  console.log("Grabbing url metadata for " + program.urlMetadata);
  try {
    await getUrlMetadata(program.urlMetadata, true);
  } catch (e) {
    console.log(e);
  }
  process.exit(0);
}

const users: User[] = getUsers(program.dataFolderPath);

const app = await startApp({
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
    app as RequestListener,
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


