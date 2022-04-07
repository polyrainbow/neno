import fs from "fs/promises";
import { constants } from 'fs';
import * as logger from "./lib/logger.js";

// Makes sure that the data directory exists. If not, create it.
const checkDataDirectory = async (directoryPath:string):Promise<void> => {
  try {
    await fs.access(
      directoryPath,
      constants.R_OK | constants.W_OK,
    );
    logger.info(`Data directory found at ${directoryPath}`);
  } catch (e) {
    logger.warn(
      `No data directory found at ${directoryPath}`,
    );
    logger.info(`Creating new data directory at ${directoryPath}`);
    await fs.mkdir(directoryPath, { recursive: true });
  }
};

export default checkDataDirectory;