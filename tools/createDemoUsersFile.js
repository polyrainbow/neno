import bcrypt from "bcryptjs";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import twofactor from "node-2fa";
import qrcode from "qrcode-terminal";

const users = [];
const username = "test";
const password = "0000";

const salt = bcrypt.genSaltSync(12);
const passwordHash = bcrypt.hashSync(password, salt);

const mfa = twofactor.generateSecret({ name: "NENO", account: username });

const uri = `otpauth://totp/NENO%3A%20${username}?secret=${mfa.secret}&issuer=NENO`;

console.log("You have created a users.json file for demo purposes");
console.log("Username: \"test\", Password: \"0000\"");
console.log("Scan this QR code with your favorite 2FA app");
console.log("URL: " + uri);
qrcode.generate(uri, { small: true }, (qrCode) => {
  users.push({
    id: uuidv4(),
    login: username,
    passwordHash: passwordHash,
    mfaSecret: mfa.secret,
    mfaUri: uri,
    qrCode,
  });

  fs.writeFileSync("users.json", JSON.stringify(users, null, "  "));
});


