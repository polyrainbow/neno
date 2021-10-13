import * as path from "path";
import { Command } from "commander";
const program = new Command();
import { REPO_PATH } from "./config.js";
import { randomUUID } from "crypto";

const getArguments = (version) => {
  program.version(version);
  
  program
    .option(
      '-p, --port <value>',
      'HTTP port',
      "80",
    )
    .option(
      '--https-port <value>',
      'HTTPS port',
      "443",
    )
    .option(
      '-d, --data-folder-path <value>',
      "path to data folder",
      path.join(REPO_PATH, "..", "neno-data"),
    )
    .option(
      '--use-https',
      "create a https server (valid cert and key must be passed as parameters)",
      false,
    )
    .option(
      '--cert-path <value>',
      "path to TLS certificate",
      path.join(REPO_PATH, "..", "server.cert"),
    )
    .option(
      '--cert-key-path <value>',
      "path to private key of TLS certificate",
      path.join(REPO_PATH, "..", "server.key"),
    )
    // by default, we generate a new secret with each app start. this can be
    // overridden with this option
    .option(
      '--session-secret <value>',
      "secret for session authentication",
      randomUUID(),
    )
    .option(
      '--url-metadata <value>',
      "don't start server, only grab url metadata for given url",
      "",
    )
    .option(
      '--session-ttl <value>',
      "time to live for a session in days",
      "30",
    );
  
  program.parse(process.argv);

  const opts = program.opts();

  return opts;
}

export default getArguments;
