import * as path from "path";
import fs from "fs";
import mkdirp from "mkdirp";
import * as config from "./config.js";
import User from "./interfaces/User.js";

const getUsers = (dataFolderPath) => {
  let users:User[];
  const usersFile = path.join(dataFolderPath, "users.json");
  if (fs.existsSync(usersFile)) {
    console.log("Loading existing users file...");
    const json = fs.readFileSync(usersFile).toString();
    users = JSON.parse(json);

    const isValid = users.every((user) => {
      return typeof user.id === "string"
        && typeof user.login === "string"
        && typeof user.passwordHash === "string";
    });

    if (!isValid) {
      console.error("User file is not valid. Please make sure that every user "
        + "has a valid id, login and passwordHash. Terminating!");
      process.exit(1);
    }
  } else {
    console.log(
      "No users file found. Creating one by myself with default users...",
    );
    mkdirp.sync(dataFolderPath);
    fs.writeFileSync(usersFile, JSON.stringify(config.DEFAULT_USERS));
    users = config.DEFAULT_USERS;
  }

  return users;
}

export default getUsers;