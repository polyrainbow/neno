import * as path from "path";
import fs from "fs/promises";
import { constants } from 'fs';
import http, { RequestListener } from "http";
import https from "https";
import startApp from "./app.js";
import getProgramArguments from "./getProgramArguments.js";
import User from "./interfaces/User.js";
import getUsers from "./users.js";
import getUrlMetadata from "./lib/getUrlMetadata.js";
import { REPO_PATH } from "./config.js";
import * as logger from "./lib/logger.js";

const VERSION = "1.0.0";
const programArguments = getProgramArguments(VERSION);

if (programArguments.urlMetadata.length > 0) {
  logger.info("Grabbing url metadata for " + programArguments.urlMetadata);
  try {
    await getUrlMetadata(programArguments.urlMetadata);
  } catch (e) {
    logger.error(e);
  }
  process.exit(0);
}

try {
  await fs.access(
    programArguments.dataFolderPath,
    constants.R_OK | constants.W_OK,
  );
  logger.info(`Data directory found at ${programArguments.dataFolderPath}`);
} catch (e) {
  logger.warn(
    `No data directory found at ${programArguments.dataFolderPath}`,
  );
  logger.info("Creating one...");
  await fs.mkdir(programArguments.dataFolderPath, { recursive: true });
}


const users: User[] = await getUsers(programArguments.dataFolderPath);

const app = await startApp({
  users,
  dataPath: programArguments.dataFolderPath,
  frontendPath: path.join(REPO_PATH, "frontend"),
  sessionSecret: programArguments.sessionSecret,
  sessionTTL: parseInt(programArguments.sessionTtl),
});

logger.info("Starting server...");

if (programArguments.useHttps) {
  const httpsServer = https.createServer(
    {
      key: await fs.readFile(programArguments.certKeyPath),
      cert: await fs.readFile(programArguments.certPath)
    },
    app as RequestListener,
  );

  httpsServer.listen(parseInt(programArguments.httpsPort));

  logger.info("HTTPS access ready on port " + programArguments.httpsPort);
  
  if (programArguments.port == "80" && programArguments.httpsPort == "443") {
    // redirect http requests to https
    http.createServer(function (req, res) {
      res.writeHead(301, {
        "Location": "https://" + req.headers['host'] + req.url,
      });
      res.end();
    }).listen(programArguments.port);

    logger.info(
      "HTTP requests to port "
      + programArguments.port + " will be redirected to HTTPS.",
    );
  }
} else {
  const httpServer = http.createServer(app);
  httpServer.listen(parseInt(programArguments.port));

  logger.info("HTTP access ready on port " + programArguments.port);
}


