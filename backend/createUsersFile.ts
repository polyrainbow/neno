import * as readline from "node:readline/promises";
import { stdin, stdout } from "process";
import { createHash, randomUUID } from "crypto";
import fs from "fs/promises";
import User from "./interfaces/User";
import * as logger from "./lib/logger.js";


export default async (filepath: string): Promise<void> => {
  const rl = readline.createInterface({
    input: stdin,
    output: stdout,
    terminal: true,
  });

  const users: User[] = [];

  const numberOfUsers
    = (await rl.question("How many users do you wish to create? (1) ")) || 1;

  for (let i = 0; i < numberOfUsers; i++) {
    logger.info(`Gathering info for user ${(i + 1)}/${numberOfUsers}`);
    const name = await rl.question("User name: ");

    logger.info("\n");

    const apiKey = randomUUID();
    // https://security.stackexchange.com/a/209940/247396 - no salt for api key
    const apiKeyHash = createHash('RSA-SHA3-256').update(apiKey).digest('hex');

    const signUpToken = randomUUID();

    users.push({
      id: randomUUID(),
      name,
      apiKeyHashes: [apiKeyHash],
      // start with one graph per user
      graphIds: [
        randomUUID(),
      ],
      signUpTokens: [
        signUpToken,
      ],
      credentials: [],
    });

    logger.info("Scan this QR code with your favorite 2FA app");
    logger.info("Your API key: " + apiKey);
  }

  await fs.writeFile(filepath, JSON.stringify(users, null, "  "));
  logger.info(`Users file created at: ${filepath}`);
};
