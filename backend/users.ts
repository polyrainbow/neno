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
  return users;
}

export default getUsers;