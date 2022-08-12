import * as path from "path";
import startApp from "./app.js";
import getProgramArguments from "./getProgramArguments.js";
import User from "./interfaces/User.js";
import Users from "./users.js";
import getUrlMetadata from "./lib/getUrlMetadata.js";
import { REPO_PATH, SERVER_TIMEOUT } from "./config.js";
import * as logger from "./lib/logger.js";
import startServer from "./server.js";
import checkDataDirectory from "./checkDataDirectory.js";

logger.info("💡 Starting NENO...");

const programArguments = getProgramArguments();

logger.verbose("Program arguments:");
logger.verbose(JSON.stringify(programArguments, null, "  "));

if (programArguments["url-metadata"].length > 0) {
  logger.info("Grabbing url metadata for " + programArguments["url-metadata"]);
  try {
    await getUrlMetadata(programArguments["url-metadata"]);
  } catch (e) {
    logger.error(e);
  }
  process.exit(0);
}

logger.info("💡 Checking data directory...");

await checkDataDirectory(programArguments["data-folder-path"]);

logger.info("💡 Getting users...");

await Users.init(programArguments["data-folder-path"]);
const users: User[] = Users.getAll();

logger.info("💡 Starting app...");

const app = await startApp({
  users,
  dataPath: programArguments["data-folder-path"],
  frontendPath: path.join(REPO_PATH, "frontend", "public"),
  sessionSecret: programArguments["session-secret"],
  sessionTTL: programArguments["session-ttl"],
  maxUploadFileSize: programArguments["max-upload-file-size"],
  sessionCookieName: programArguments["session-cookie-name"],
  maxGraphSize: programArguments["max-graph-size"],
});

logger.info("💡 Starting server...");

await startServer({
  app,
  certKeyPath: programArguments["cert-key-path"],
  certPath: programArguments["cert-path"],
  useHttps: programArguments["use-https"],
  httpPort: programArguments["http-port"],
  httpsPort: programArguments["https-port"],
  timeout: SERVER_TIMEOUT,
  ipv6Only: programArguments["ipv6-only"],
});

logger.info("✅ Ready.");
