import * as path from "path";
import fs from "fs";
import http, { RequestListener } from "http";
import https from "https";
import startApp from "./app.js";
import getProgramArguments from "./getProgramArguments.js";
import User from "./interfaces/User.js";
import getUsers from "./users.js";
import getUrlMetadata from "./lib/getUrlMetadata.js";
import { REPO_PATH } from "./config.js";

const VERSION = "1.0.0";
const programArguments = getProgramArguments(VERSION);

if (programArguments.urlMetadata.length > 0) {
  console.log("Grabbing url metadata for " + programArguments.urlMetadata);
  try {
    await getUrlMetadata(programArguments.urlMetadata, true);
  } catch (e) {
    console.log(e);
  }
  process.exit(0);
}

const users: User[] = getUsers(programArguments.dataFolderPath);

const app = await startApp({
  users,
  dataPath: programArguments.dataFolderPath,
  frontendPath: path.join(REPO_PATH, "frontend"),
  sessionSecret: programArguments.sessionSecret,
  sessionTTL: parseInt(programArguments.sessionTtl),
});


if (programArguments.useHttps) {
  const httpsServer = https.createServer(
    {
      key: fs.readFileSync(programArguments.certKeyPath),
      cert: fs.readFileSync(programArguments.certPath)
    },
    app as RequestListener,
  );

  httpsServer.listen(parseInt(programArguments.httpsPort));

  console.log("HTTPS access ready on port " + programArguments.httpsPort);
  
  if (programArguments.port == "80" && programArguments.httpsPort == "443") {
    // redirect http requests to https
    http.createServer(function (req, res) {
      res.writeHead(301, {
        "Location": "https://" + req.headers['host'] + req.url,
      });
      res.end();
    }).listen(programArguments.port);

    console.log(
      "HTTP requests to port "
      + programArguments.port + " will be redirected to HTTPS.",
    );
  }
} else {
  const httpServer = http.createServer(app);
  httpServer.listen(parseInt(programArguments.port));

  console.log("HTTP access ready on port " + programArguments.port);
}


