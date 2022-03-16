// @ts-ignore
import * as readline from "node:readline/promises";
import { stdin } from "process";
import bcrypt from "bcryptjs";
import fs from "fs/promises";
import { randomUUID } from "crypto";
import twofactor from "node-2fa";
import qrcode from "qrcode-terminal";
import User from "./interfaces/User";
import * as logger from "./lib/logger.js";
import MuteableStdout from "./lib/MuteableStdout.js";


export default async (filepath) => {
  const muteableStdout = new MuteableStdout();

  const rl = readline.createInterface({
    input: stdin,
    output: muteableStdout,
    terminal: true,
  });

  const users:User[] = [];

  const numberOfUsers
    = (await rl.question("How many users do you wish to create? (1) ")) || 1;

  for (let i = 0; i < numberOfUsers; i++) {
    logger.info(`Gathering info for user ${(i + 1)}/${numberOfUsers}`);
    const username = await rl.question("User name: ");

    muteableStdout.write("Password: ");
    muteableStdout.muted = true;
    const password = await rl.question();
    muteableStdout.muted = false;
    muteableStdout.write("\n");

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
      // start with one graph per user
      graphIds: [
        randomUUID(),
      ]
    });

    logger.info("Scan this QR code with your favorite 2FA app");
    logger.info("URL: " + uri);
    qrcode.generate(uri, { small: true });
  }

  await fs.writeFile(filepath, JSON.stringify(users, null, "  "));
  logger.info(`Users file created at: ${filepath}`);
};
