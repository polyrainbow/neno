import readlineSync from "readline-sync";
import bcrypt from "bcryptjs";
import fs from "fs";
import { randomUUID } from "crypto";
import twofactor from "node-2fa";
import qrcode from "qrcode-terminal";

const users = [];

const numberOfUsers
  = readlineSync.question("How many users do you wish to create? (1) ") || 1;

for (let i = 0; i < numberOfUsers; i++) {
  console.log("Gathering info for user " + (i + 1));
  const username = readlineSync.question("User name: ");

  const password = readlineSync.question("Password: ", {
    hideEchoBack: true, // The typed text on screen is hidden by `*` (default).
    mask: "",
  });

  const salt = bcrypt.genSaltSync(12);
  const passwordHash = bcrypt.hashSync(password, salt);

  const mfa = twofactor.generateSecret({ name: "NENO", account: username });

  const uri = `otpauth://totp/NENO%3A%20${username}?secret=${mfa.secret}&issuer=NENO`;

  users.push({
    id: randomUUID(),
    login: username,
    passwordHash: passwordHash,
    mfaSecret: mfa.secret,
    mfaUri: uri,
    apiKeys: [],
  });

  console.log("Scan this QR code with your favorite 2FA app");
  console.log("URL: " + uri);
  qrcode.generate(uri, { small: true });
}

fs.writeFileSync("users.json", JSON.stringify(users, null, "  "));
console.log("users.json file created! Please put this into the data folder");
