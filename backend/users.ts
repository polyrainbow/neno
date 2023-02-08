/*
  This module manages the users file.
  Initialize it to read the users file to memory.
*/

import * as path from "path";
import fs from "fs/promises";
import { constants } from 'fs';
import User, { StoredCredentials } from "./interfaces/User.js";
import createUsersFile from "./createUsersFile.js";
import * as logger from "./lib/logger.js";

const USERS_FILENAME = "users.json";
let dataFolderPath: string | null = null;

const isValidUser = (user: User): boolean => {
  const idContainsOnlyValidChars = (id) => /^[A-Za-z0-9-]+$/.test(id);

  return (
    typeof user.id === "string"
    && idContainsOnlyValidChars(user.id)
    && Array.isArray(user.graphIds)
    && Array.isArray(user.apiKeyHashes)
    // a graph id must not include special characters
    && user.graphIds.every(idContainsOnlyValidChars)
  );
};

const getFromFile = async () => {
  if (!dataFolderPath) throw new Error(
    "Users module has not been initialized yet.",
  );

  const usersFile = path.join(dataFolderPath, USERS_FILENAME);

  try {
    await fs.access(usersFile, constants.R_OK | constants.W_OK);
  } catch {
    logger.warn(
      "No users file found. We must create one.",
    );
    await createUsersFile(usersFile);
  }

  logger.debug("Loading users file...");
  const json = (await fs.readFile(usersFile)).toString();
  const usersFromFile: User[] = JSON.parse(json);

  if (!usersFromFile.every(isValidUser)){
    throw new Error("Invalid users file.");
  }

  return usersFromFile;
};

const init = (_dataFolderPath: string): void => {
  dataFolderPath = _dataFolderPath;
};


const addCredentials = async (
  userId: string,
  credentials: StoredCredentials,
): Promise<void> => {
  if (!dataFolderPath) throw new Error(
    "Users module has not been initialized yet.",
  );

  const users = await getFromFile();
  const user = users.find((user) => user.id === userId);
  if (!user) throw new Error("User not found");
  user.credentials.push(credentials);
  const usersFile = path.join(dataFolderPath, USERS_FILENAME);
  await fs.writeFile(usersFile, JSON.stringify(users, null, "  "));
};

const getAll = async (): Promise<User[]> => {
  if (!dataFolderPath) throw new Error(
    "Users module has not been initialized yet.",
  );

  const users = await getFromFile();
  return users;
};


const find = async (fn: (user: User) => boolean): Promise<User | undefined> => {
  const users = await getAll();
  return users.find(fn);
};


export {
  init,
  getAll,
  find,
  addCredentials,
};