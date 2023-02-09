import * as config from "./config.js";
import compression from "compression";
import express, { NextFunction, Response } from "express";
import * as Notes from "../lib/notes/index.js";
import APIResponse from "./interfaces/APIResponse.js";
import { APIError } from "./interfaces/APIError.js";
import cookieParser from "cookie-parser";
import AppStartOptions from "./interfaces/AppStartOptions.js";
import FileSystemStorageProvider from "./lib/FileSystemStorageProvider.js";
import historyAPIFallback from "./lib/HistoryAPIFallback.js";
import * as path from "path";
import session from "express-session";
import User from "./interfaces/User.js";
import { createHash, randomUUID } from "crypto";
import FileSessionStore from "./lib/FileSessionStore.js";
import * as logger from "./lib/logger.js";
import { UserId } from "./interfaces/UserId.js";
import { GraphId } from "../lib/notes/interfaces/GraphId";
import getDocumentTitle from "./lib/getDocumentTitle.js";
import * as Users from "./users.js";
import registerGraphHandlers from "./registerGraphHandlers.js";
import registerUserHandlers from "./registerUserHandlers.js";

const startApp = async ({
  dataPath,
  frontendPath,
  sessionSecret,
  sessionTTL,
  maxUploadFileSize,
  sessionCookieName,
  maxGraphSize,
}: AppStartOptions): Promise<Express.Application> => {
  await Users.init(dataPath);
  const graphsDirectoryPath = path.join(dataPath, config.GRAPHS_DIRECTORY_NAME);
  const storageProvider = new FileSystemStorageProvider(graphsDirectoryPath);
  logger.info("File system storage ready at " + graphsDirectoryPath);
  logger.info("Session TTL: " + sessionTTL.toString() + " day(s)");
  logger.info(
    "Maximum upload file size: " + maxUploadFileSize.toString() + " byte(s)",
  );
  logger.info("Initializing notes module...");
  await Notes.init(storageProvider, randomUUID);

  logger.info("Initializing routes...");
  const app = express();

  const sessionMiddleware = session({
    secret: sessionSecret,
    saveUninitialized: false,
    cookie: {
      maxAge: sessionTTL * 24 * 60 * 60 * 1000, // days to ms
      path: '/',
      httpOnly: true,
      secure: "auto",
    },
    resave: false,
    name: sessionCookieName,
    unset: "keep",
    // @ts-ignore
    store: new (FileSessionStore(session))({
      checkPeriod: 86400000, // prune expired entries every 24h,
      maxNumberOfSessions: 1000,
      filePath: path.join(dataPath, "sessions.json"),
    }),
  });


  const getUserByApiKey = async (
    submittedApiKey: string,
  ): Promise<User | null> => {
    const submittedApiKeyHash
      = createHash('RSA-SHA3-256').update(submittedApiKey).digest('hex');

    const user = await Users.find((user) => {
      return user.apiKeyHashes.some(apiKeyHash => {  
        return submittedApiKeyHash === apiKeyHash;
      });
    });

    return user ?? null;
  };


  const getGraphIdsForUser = async (userId: UserId): Promise<GraphId[]> => {
    const user = await Users.find((user) => user.id === userId);
  
    if (!user) {
      throw new Error("Unknown user id");
    }
  
    return user.graphIds;
  };


  const verifyUser = async (
    req: any,
    res: any,
    next: NextFunction,
  ) => {
    if (req.session.userId) {
      // make the user id available in the req object for easier access
      req.userId = req.session.userId;

      // if the user passed a graph id as param, they must have the rights to
      // access it
      if (req.params.graphId) {
        const graphIds = await getGraphIdsForUser(req.userId);
        if (!graphIds.includes(req.params.graphId)){
          const response: APIResponse = {
            success: false,
            error: APIError.INVALID_REQUEST,
          };
          return res.status(406).json(response);
        }
      }
      next();

    // if userId has not been set via session, check if api key is present
    } else if (typeof req.headers["x-auth-token"] === "string") {
      const apiKey = req.headers["x-auth-token"];
      const user = await getUserByApiKey(apiKey);

      if (user) {
        req.userId = user.id;

        // if the user passed a graph id as param, they must have the rights to
        // access it
        if (req.params.graphId) {
          const graphIds = await getGraphIdsForUser(req.userId);
          if (!graphIds.includes(req.params.graphId)){
            const response: APIResponse = {
              success: false,
              error: APIError.INVALID_REQUEST,
            };
            return res.status(406).json(response);
          }
        }
        next();
      } else {
        logger.verbose("User provided invalid API key: " + apiKey);
        const response: APIResponse = {
          success: false,
          error: APIError.INVALID_CREDENTIALS,
        };
        return res.status(401).json(response);
      }
    } else {
      const response: APIResponse = {
        success: false,
        error: APIError.UNAUTHORIZED,
      };
      return res.status(401).json(response);
    }
  };

  //CORS middleware
  const allowCORS = async (
    req: any,
    res: any,
    next: NextFunction,
  ): Promise<void> => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Methods',
      'GET, PUT, POST, PATCH, DELETE, OPTIONS',
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, Content-Type, X-Auth-Token',
    );

    if (req.method === "OPTIONS") {
      res.status(200).end();
    } else {
      next();
    }
  };

  app.use("/", express.static(frontendPath));
  app.use(compression());
  app.use(cookieParser());
  app.use(allowCORS);

  // express.json() strangely returns a HTML document on JSON parsing errors.
  // Even worse, this HTML document contains the complete file path on the
  // server of the JSON file. To close this major security flaw, we handle
  // errors more gracefully
  // See https://stackoverflow.com/a/58165719/3890888 + comment
  const handleJSONParseErrors = (err, _req, res, next) => {
    // @ts-ignore
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
      const response: APIResponse = {
        success: false,
        error: APIError.INVALID_REQUEST,
        // @ts-ignore
        errorMessage: err.message,
      };
      res.status(400).json(response);
    } else {
      next();
    }
  };

  registerGraphHandlers(
    app,
    sessionMiddleware,
    verifyUser,
    handleJSONParseErrors,
    maxUploadFileSize,
    maxGraphSize,
  );

  registerUserHandlers(
    app,
    sessionMiddleware,
    verifyUser,
    handleJSONParseErrors,
    sessionCookieName,
    getGraphIdsForUser,
  );

  app.get(
    config.API_PATH + "document-title",
    sessionMiddleware,
    verifyUser,
    async (req, res) => {
      const url = req.query.url;

      if (!url || (typeof url !== "string")) {
        const response: APIResponse = {
          "success": false,
          error: APIError.INVALID_REQUEST,
          errorMessage: "URL not provided",
        };
        res.json(response);
        return;
      }

      const urlDecoded = decodeURIComponent(url);

      try {
        const documentTitle = await getDocumentTitle(urlDecoded);
        const response: APIResponse = {
          success: true,
          payload: documentTitle,
        };
        res.json(response);
      } catch (e) {
        logger.verbose("Error getting document title");
        logger.verbose(JSON.stringify(e));
        const response: APIResponse = {
          "success": false,
          error: APIError.DOCUMENT_TITLE_NOT_AVAILABLE,
          errorMessage: e instanceof Error ? e.message : "Unknown error",
        };
        res.json(response);
      }
    },
  );

  app.get(config.API_PATH, function(_req, res) {
    const response: APIResponse = {
      success: true,
      payload: "Hello world!",
    };
    res.json(response);
  });

  app.use(
    historyAPIFallback(
      'index.html',
      {
        root: path.resolve(frontendPath),
      },
    ),
  );

  app.use((_req, res: Response) => {
    res.status(404).end("Not found");
  });

  return app;
};

export default startApp;
