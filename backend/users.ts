import * as path from "path";
import fs from "fs";
import User from "./interfaces/User.js";

const getUsers = (dataFolderPath) => {
  const usersFile = path.join(dataFolderPath, "users.json");

  if (!fs.existsSync(usersFile)) {
    console.log(
      "ERROR: No users file found. Please create one with tools/createUsersFile.js",
    );
    process.exit(1);
  }
  
  console.log("Loading existing users file...");
  const json = fs.readFileSync(usersFile).toString();
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