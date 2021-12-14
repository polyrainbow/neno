import * as path from "path";
import fs from "fs/promises";
import { constants } from 'fs';
import User from "./interfaces/User.js";
import createUsersFile from "./createUsersFile.js";
import * as logger from "./lib/logger.js";

const USERS_FILENAME = "users.json";
let dataFolderPath:string | null = null;
let users:User[] | null = null;

const isValidUser = (user) => {
  const idContainsOnlyValidChars = (id) => /^[A-Za-z0-9-]+$/.test(id);

  return (
    typeof user.id === "string"
    && idContainsOnlyValidChars(user.id)
    && typeof user.login === "string"
    && typeof user.passwordHash === "string"
    && typeof user.mfaSecret === "string"
    && Array.isArray(user.graphIds)
    // a graph id must not include special characters
    && user.graphIds.every(idContainsOnlyValidChars)
  );
}

const init = async (_dataFolderPath:string) => {
  dataFolderPath = _dataFolderPath;
  const usersFile = path.join(dataFolderPath, USERS_FILENAME);

  try {
    await fs.access(usersFile, constants.R_OK | constants.W_OK);
  } catch {
    logger.warn(
      "No users file found. We must create one.",
    );
    await createUsersFile(usersFile);
  }

  logger.info("Loading users file...");
  const json = (await fs.readFile(usersFile)).toString();
  const usersFromFile:User[] = JSON.parse(json);

  if (!usersFromFile.every(isValidUser)){
    throw new Error("Invalid users file.");
  }

  users = usersFromFile;
}

const getAll = ():User[] => {
  if (users === null) {
    throw new Error("Users module not correctly initialized.");
  }

  return users;
}


export default {
  init,
  getAll,
};