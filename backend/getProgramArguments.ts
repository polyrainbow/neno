import * as path from "path";
import { REPO_PATH } from "./config.js";
import { randomUUID } from "crypto";
import { parseArgs } from 'node:util';
import {
  ParseArgsOptionConfig,
  ProgramArgumentInformation,
  ProgramArguments,
  ProgramArgumentsDescription,
} from "./interfaces/ProgramArguments.js";

export default (): ProgramArguments => {
  const options: ProgramArgumentsDescription = {
    "http-port": {
      "type": "integer",
      "short": "p",
      "default": 80,
      "description": "HTTP port",
    },
    "https-port": {
      "type": "integer",
      "default": 443,
      "description": "HTTPS port",
    },
    "data-folder-path": {
      "type": "string",
      "short": "d",
      "default": path.join(REPO_PATH, "..", "neno-data"),
      "description": "The path to the folder where this program stores all of its data",
    },
    "use-https": {
      "type": "boolean",
      "default": false,
      "description": "create a https server (valid cert and key must be passed as parameters)",
    },
    "cert-path": {
      "type": "string",
      "default": path.join(REPO_PATH, "..", "server.cert"),
      "description": "path to TLS certificate",
    },
    "cert-key-path": {
      "type": "string",
      "description": "path to private key of TLS certificate",
      "default": path.join(REPO_PATH, "..", "server.key"),
    },
    // by default, we generate a new secret with each app start. this can be
    // overridden with this option
    "session-secret": {
      "type": "string",
      "description": "secret for session authentication",
      "default": randomUUID(),
    },
    "session-ttl": {
      "type": "integer",
      "description": "time to live for a session in days",
      "default": 30,
    },
    "max-upload-file-size": {
      "type": "integer",
      "description": "the maximum size of an upload in bytes",
      "default": 524288000, // 500 MB
    },
    "session-cookie-name": {
      "type": "string",
      "description": "the name of the session cookie in which the auth token is stored",
      "default": "NENO_token",
    },
    "ipv6-only": {
      "type": "boolean",
      "description": "only allow IPv6 connections",
      "default": false,
    },
    "max-graph-size": {
      "type": "integer",
      "description": "The maximum size of one graph in bytes",
      "default": 107374182400, // 100 GB
    },
  };

  // format options for util.parseArgs()
  const parsedArgsOptions = Object.fromEntries(
    Object.entries(options)
      .map(
        ([key, value]: [string, ProgramArgumentInformation]): [string, ParseArgsOptionConfig] => {
          const newValue: ParseArgsOptionConfig = {
            "type": value.type === "integer" ? "string" : value.type,
          };

          if (value.short) newValue.short = value.short;
          return [key, newValue];
        },
      ),
  );

  const parsedArgsResult = parseArgs({ options: parsedArgsOptions });

  // parse results to correct types
  const parsedArgsFormatted = Object.fromEntries(
    Object.entries(
      parsedArgsResult.values
    ).map(
      ([key, value]) => {
        const newValue = options[key].type === "integer" ? parseInt(value as string) : value;
        return [key, newValue];
      },
    ),
  );


  // get default args object
  const defaultArgs = Object.fromEntries(
    Object.entries(options)
      .map(
        ([key, value]: [string, ProgramArgumentInformation]): [string, string | boolean | number] => {
          const newValue = value.default;
          return [key, newValue];
        },
      ),
  );
  
  // combine defaults with results
  const args = {
    ...defaultArgs,
    ...parsedArgsFormatted,
  } as unknown as ProgramArguments;

  return args;
};
