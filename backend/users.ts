import * as path from "path";
import fs from "fs/promises";
import { constants } from 'fs';
import User from "./interfaces/User.js";
import createUsersFile from "./createUsersFile.js";
import * as logger from "./lib/logger.js";

const getUsers = async (dataFolderPath) => {
  const usersFile = path.join(dataFolderPath, "users.json");

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
  const users:User[] = JSON.parse(json);

  if (!users.every((user) => {
    const isValidUser = (
      typeof user.id === "string"
      && typeof user.login === "string"
      && typeof user.passwordHash === "string"
      && typeof user.mfaSecret === "string"
    );

    return isValidUser;
  })){
    throw new Error("Invalid users file.");
  }

  return users;
}

export default getUsers;