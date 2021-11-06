import * as path from "path";
import fs from "fs/promises";
import { constants } from 'fs';
import User from "./interfaces/User.js";
import createUsersFile from "./createUsersFile.js";

const getUsers = async (dataFolderPath) => {
  const usersFile = path.join(dataFolderPath, "users.json");

  try {
    await fs.access(usersFile, constants.R_OK | constants.W_OK);
  } catch {
    console.log(
      "WARN: No users file found. We must create one.",
    );
    await createUsersFile(usersFile);
  }

  console.log("Loading users file...");
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

  if (users[0].login === "test") {
    console.log("WARNING: You have created a users file which is only suitable for testing");
    console.log("Do not use this in production.");
    console.log("Scan this QR code with your favorite 2FA app:");
    console.log(users[0].qrCode);
  }
  return users;
}

export default getUsers;