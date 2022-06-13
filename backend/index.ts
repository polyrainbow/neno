import * as path from "path";
import startApp from "./app.js";
import getProgramArguments from "./getProgramArguments.js";
import User from "./interfaces/User.js";
import Users from "./users.js";
import getUrlMetadata from "./lib/getUrlMetadata.js";
import { REPO_PATH, VERSION, SERVER_TIMEOUT } from "./config.js";
import * as logger from "./lib/logger.js";
import startServer from "./server.js";
import checkDataDirectory from "./checkDataDirectory.js";

logger.info("💡 Starting NENO...");

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

logger.info("💡 Checking data directory...");

await checkDataDirectory(programArguments.dataFolderPath);

logger.info("💡 Getting users...");

await Users.init(programArguments.dataFolderPath);
const users: User[] = Users.getAll();

logger.info("💡 Starting app...");

const app = await startApp({
  users,
  dataPath: programArguments.dataFolderPath,
  frontendPath: path.join(REPO_PATH, "frontend", "public"),
  sessionSecret: programArguments.sessionSecret,
  sessionTTL: parseInt(programArguments.sessionTtl),
  maxUploadFileSize: parseInt(programArguments.maxUploadFileSize),
  sessionCookieName: programArguments.sessionCookieName,
});

logger.info("💡 Starting server...");

await startServer({
  app,
  certKeyPath: programArguments.certKeyPath,
  certPath: programArguments.certPath,
  useHttps: programArguments.useHttps,
  httpPort: parseInt(programArguments.httpPort),
  httpsPort: parseInt(programArguments.httpsPort),
  timeout: SERVER_TIMEOUT,
  ipv6Only: programArguments.ipv6Only,
});

logger.info("✅ Ready.");
