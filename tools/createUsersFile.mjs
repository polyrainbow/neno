import readlineSync from "readline-sync";
import bcrypt from "bcryptjs";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

const users = [];

const numberOfUsers
  = readlineSync.question('How many users do you wish to create? ') || 1;

for (let i = 0; i < numberOfUsers; i++) {
  console.log("Gathering info for user " + (i + 1));
  const username = readlineSync.question('User name: ');

  var password = readlineSync.question('Password: ', {
    hideEchoBack: true, // The typed text on screen is hidden by `*` (default).
    mask: "",
  });
  
  const salt = bcrypt.genSaltSync(12);
  const passwordHash = bcrypt.hashSync(password, salt);

  users.push({
    id: uuidv4(),
    login: username,
    passwordHash: passwordHash,
  });
}

fs.writeFileSync("users.json", JSON.stringify(users));
console.log("users.json file created! Please put this into the data folder");
