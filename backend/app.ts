import NoteToTransmit from "../lib/notes/interfaces/NoteToTransmit.js";
import { NoteId } from "../lib/notes/interfaces/NoteId.js";
import Stats from "../lib/notes/interfaces/GraphStats.js";
import { yyyymmdd } from "../lib/utils.js";
import * as config from "./config.js";
import compression from "compression";
import express, { Response } from "express";
import * as Notes from "../lib/notes/index.js";
import bcrypt from "bcryptjs";
import APIResponse from "./interfaces/APIResponse.js";
import { APIError } from "./interfaces/APIError.js";
import cookieParser from "cookie-parser";
import AppStartOptions from "./interfaces/AppStartOptions.js";
import NoteListPage from "../lib/notes/interfaces/NoteListPage.js";
import FileSystemStorageProvider from "./lib/FileSystemStorageProvider.js";
import getUrlMetadata from "./lib/getUrlMetadata.js";
import twofactor from "node-2fa";
import historyAPIFallback from "./lib/HistoryAPIFallback.js";
import * as path from "path";
import session from "express-session";
import User from "./interfaces/User.js";
import { randomUUID } from "crypto";
import FileSessionStore from "./lib/FileSessionStore.js";
import * as logger from "./lib/logger.js";
import { NoteListSortMode } from "../lib/notes/interfaces/NoteListSortMode.js";
import { UserId } from "./interfaces/UserId.js";
import { GraphId } from "./interfaces/GraphId.js";
import BruteForcePreventer from "./BruteForcePreventer.js";
import GraphStatsRetrievalOptions from "../lib/notes/interfaces/GraphStatsRetrievalOptions.js";
import Ajv from "ajv";
import noteFromUserSchema from "../lib/notes/schemas/NoteFromUser.schema.json" assert { type: 'json' };
import graphObjectSchema from "../lib/notes/schemas/GraphObject.schema.json" assert { type: 'json' };
import NoteFromUser from "../lib/notes/interfaces/NoteFromUser.js";
import graphVisualizationFromUserSchema from "../lib/notes/schemas/GraphVisualizationFromUser.schema.json" assert { type: 'json' };
import GraphVisualizationFromUser from "../lib/notes/interfaces/GraphVisualizationFromUser.js";
import GraphObject from "../lib/notes/interfaces/Graph.js";

const startApp = async ({
  users,
  dataPath,
  frontendPath,
  sessionSecret,
  sessionTTL,
  maxUploadFileSize,
  sessionCookieName,
}:AppStartOptions):Promise<Express.Application> => {
  const graphsDirectoryPath = path.join(dataPath, config.GRAPHS_DIRECTORY_NAME);
  const storageProvider = new FileSystemStorageProvider(graphsDirectoryPath);
  logger.info("File system storage ready at " + graphsDirectoryPath);
  logger.info("Session TTL: " + sessionTTL.toString() + " day(s)");
  logger.info(
    "Maximum upload file size: " + maxUploadFileSize.toString() + " byte(s)",
  );
  logger.info("Initializing notes module...");
  await Notes.init(storageProvider, randomUUID, getUrlMetadata);
  logger.info("Initializing routes...");
  const app = express();

  const bruteForcePreventer = new BruteForcePreventer();

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
    store: new (FileSessionStore(session))({
      checkPeriod: 86400000, // prune expired entries every 24h,
      maxNumberOfSessions: 1000,
      filePath: path.join(dataPath, "sessions.json"),
    }),
  });


  const ajv = new Ajv();

  const validateNoteFromUser = ajv.compile(noteFromUserSchema);
  const validateGraphVisualizationFromUser = ajv.compile(graphVisualizationFromUserSchema);
  const validateGraphObject = ajv.compile(graphObjectSchema);

  const getUserByApiKey = (apiKey:string):User | null => {
    const user = users.find((user) => {
      return user.apiKeys?.includes(apiKey);
    });

    return user ?? null;
  };


  const getGraphIdsForUser = (userId:UserId):GraphId[] => {
    const user = users.find((user) => user.id === userId);
  
    if (!user) {
      throw new Error("Unknown user id");
    }
  
    return user.graphIds;
  };


  const verifyUser = (req, res, next) => {
    if (req.session.userId) {
      // make the user id available in the req object for easier access
      req.userId = req.session.userId;

      // if the user passed a graph id as param, they must have the rights to
      // access it
      if (req.params.graphId) {
        const graphIds = getGraphIdsForUser(req.userId);
        if (!graphIds.includes(req.params.graphId)){
          const response:APIResponse = {
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
      const user = getUserByApiKey(apiKey);

      if (user) {
        req.userId = user.id;

        // if the user passed a graph id as param, they must have the rights to
        // access it
        if (req.params.graphId) {
          const graphIds = getGraphIdsForUser(req.userId);
          if (!graphIds.includes(req.params.graphId)){
            const response:APIResponse = {
              success: false,
              error: APIError.INVALID_REQUEST,
            };
            return res.status(406).json(response);
          }
        }
        next();
      } else {
        logger.verbose("User provided invalid API key: " + apiKey);
        const response:APIResponse = {
          success: false,
          error: APIError.INVALID_CREDENTIALS,
        };
        return res.status(401).json(response);
      }
    } else {
      const response:APIResponse = {
        success: false,
        error: APIError.UNAUTHORIZED,
      };
      return res.status(401).json(response);
    }
  };

  //CORS middleware
  const allowCORS = (req, res, next) => {
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
      return res.status(200).end();
    }

    next();
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
      const response:APIResponse = {
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


  /* ***************
    Endpoints
  *****************/

  /* ***************
    Endpoints with authentication required
  *****************/

  app.get(
    config.USER_ENDOPINT + "authenticated",
    sessionMiddleware,
    verifyUser,
    async function(req, res) {
      const response:APIResponse = {
        success: true,
        payload: {
          graphIds: getGraphIdsForUser(req.userId),
        },
      };
      res.json(response);
    },
  );


  app.get(
    config.GRAPH_ENDPOINT,
    sessionMiddleware,
    verifyUser,
    async function(req, res) {
      const graphId = req.params.graphId;
      const withFiles = req.query.withFiles === "true";

      try {
        const databaseStream = (await Notes.getReadableGraphStream(
          graphId,
          withFiles,
        )) as NodeJS.ReadStream;

        databaseStream.on('error', function(err) {
          logger.verbose("Error on getting database stream");
          logger.verbose(err);

          const response:APIResponse = {
            success: false,
            error: APIError.INVALID_REQUEST,
          };
          res.status(400).json(response);
        });
  
        // set the archive name
        const dateSuffix = yyyymmdd(new Date());
  
        const extension = withFiles ? "zip" : "json";
        const filename = `neno-${graphId}-${dateSuffix}.db.${extension}`;
        res.attachment(filename);
  
        // this is the streaming magic
        databaseStream.pipe(res);
      } catch(e) {
        const response:APIResponse = {
          success: false,
          error: APIError.INVALID_REQUEST,
        };
        res.status(400).json(response);
      }
    },
  );


  app.put(
    config.GRAPH_ENDPOINT,
    sessionMiddleware,
    verifyUser,
    express.json(), // returns {} on non-JSON request bodies
    handleJSONParseErrors,
    async function(req, res) {
      const graphId = req.params.graphId;
      const graphObject = req.body;

      const isValid = validateGraphObject(
        graphObject,
      );

      if (!isValid) {
        const response:APIResponse = {
          success: false,
          error: APIError.INVALID_REQUEST,
        };
        res.json(response);
        return;
      }
      
      const response:APIResponse = {
        success: false,
      };
    
      try {
        await Notes.importDB(graphObject as unknown as GraphObject, graphId);
        response.success = true;
      } catch(e) {
        response.success = false;
        response.error = APIError.INTERNAL_SERVER_ERROR;
      } finally {
        res.status(response.success ? 200 : 500).json(response);
      }
    },
  );


  app.get(
    config.GRAPH_ENDPOINT + "graph-visualization",
    sessionMiddleware,
    verifyUser,
    async function(req, res) {
      const graphId = req.params.graphId;
      const graph = await Notes.getGraphVisualization(graphId);
      const response:APIResponse = {
        success: true,
        payload: graph,
      };
      res.json(response);
    },
  );


  app.get(
    config.GRAPH_ENDPOINT + "stats",
    sessionMiddleware,
    verifyUser,
    async function(req, res) {
      const graphId = req.params.graphId;
      const options:GraphStatsRetrievalOptions = {
        includeMetadata: req.query.includeMetadata === "true",
        includeAnalysis: req.query.includeAnalysis === "true",
      };
      const stats:Stats = await Notes.getStats(graphId, options);
      const response:APIResponse = {
        success: true,
        payload: stats,
      };
      res.json(response);
    },
  );


  app.post(
    config.GRAPH_ENDPOINT + "graph-visualization",
    sessionMiddleware,
    verifyUser,
    // posting a graph can be somewhat larger, so let's increase upload limit
    // from 100kb to 1mb
    express.json({ limit: "1mb" }),
    handleJSONParseErrors,
    async function(req, res) {
      const graphId = req.params.graphId;
      const graphVisualizationFromUser = req.body;

      const isValid = validateGraphVisualizationFromUser(
        graphVisualizationFromUser,
      );

      if (!isValid) {
        const response:APIResponse = {
          success: false,
          error: APIError.INVALID_REQUEST,
        };
        res.json(response);
        return;
      }

      try {
        await Notes.setGraphVisualization(
          graphVisualizationFromUser as unknown as GraphVisualizationFromUser,
          graphId,
        );
        const response:APIResponse = {
          success: true,
        };
        res.json(response);
      } catch (e) {
        const response:APIResponse = {
          success: false,
          error: APIError.INTERNAL_SERVER_ERROR,
        };
        res.json(response);
      }
    },
  );


  app.get(
    config.GRAPH_ENDPOINT + "notes",
    sessionMiddleware,
    verifyUser,
    async function(req, res) {
      const graphId = req.params.graphId;
      const searchString = req.query.searchString as (string | undefined) || "";
      const caseSensitive = req.query.caseSensitive === "true";
      const page = typeof req.query.page === "string"
        ? parseInt(req.query.page)
        : 1;
      const sortMode = req.query.sortMode as NoteListSortMode;
      const limit = typeof req.query.limit === "string"
        ? parseInt(req.query.limit)
        : 0;

      const notesListPage:NoteListPage = await Notes.getNotesList(
        graphId,
        {
          searchString,
          caseSensitive,
          page,
          sortMode,
          limit,
        },
      );

      const response:APIResponse = {
        success: true,
        payload: notesListPage,
      };
      res.json(response);
    },
  );


  app.get(
    config.GRAPH_ENDPOINT + "note/:noteId",
    sessionMiddleware,
    verifyUser,
    async function(req, res) {
      const graphId = req.params.graphId;
      const noteId:NoteId = parseInt(req.params.noteId);

      try {
        const note:NoteToTransmit = await Notes.get(noteId, graphId);
        const response:APIResponse = {
          success: true,
          payload: note,
        };
        res.json(response);
      } catch (e) {
        const response:APIResponse = {
          success: false,
          error: APIError.NOTES_APPLICATION_ERROR,
          errorMessage: e instanceof Error ? e.message : "Unknown notes module error",
        };
        res.json(response);
      }
    },
  );


  app.put(
    config.GRAPH_ENDPOINT + "note",
    sessionMiddleware,
    verifyUser,
    express.json(),
    handleJSONParseErrors,
    async function(req, res) {
      const graphId = req.params.graphId;
      const reqBody = req.body;

      const noteFromUser = reqBody.note;

      const isValid = validateNoteFromUser(noteFromUser);

      if (!isValid) {
        const response:APIResponse = {
          success: false,
          error: APIError.INVALID_REQUEST,
        };
        res.json(response);
        return;
      }

      try {
        const noteToTransmit:NoteToTransmit = await Notes.put(
          noteFromUser as unknown as NoteFromUser,
          graphId,
          reqBody.options,
        );

        const response:APIResponse = {
          success: true,
          payload: noteToTransmit,
        };
        res.json(response);
      } catch (e) {
        const response:APIResponse = {
          success: false,
          error: APIError.NOTES_APPLICATION_ERROR,
          errorMessage: e instanceof Error ? e.message : "Unknown notes module error",
        };
        res.json(response);
      }
    },
  );


  app.put(
    config.GRAPH_ENDPOINT + "import-links-as-notes",
    sessionMiddleware,
    verifyUser,
    express.json(),
    handleJSONParseErrors,
    async function(req, res) {
      const graphId = req.params.graphId;
      const reqBody = req.body;
      const links:string[] = reqBody.links;

      const result = await Notes.importLinksAsNotes(graphId, links);

      const response:APIResponse = {
        payload: result,
        success: true,
      };
      res.json(response);
    },
  );


  app.delete(
    config.GRAPH_ENDPOINT + "note/:noteId",
    sessionMiddleware,
    verifyUser,
    async function(req, res) {
      try {
        const graphId = req.params.graphId;
        await Notes.remove(parseInt(req.params.noteId), graphId);
        const response:APIResponse = {
          success: true,
        };
        res.json(response);
      } catch (e) {
        const response:APIResponse = {
          success: false,
          error: APIError.NOTES_APPLICATION_ERROR,
          errorMessage: e instanceof Error ? e.message : "Unknown notes module error",
        };
        res.json(response);
      }
    },
  );


  app.post(
    config.GRAPH_ENDPOINT + "file",
    sessionMiddleware,
    verifyUser,
    async function(req, res) {
      const graphId = req.params.graphId;
      const sizeString = req.headers["content-length"];

      if (typeof sizeString !== "string") {
        const response:APIResponse = {
          success: false,
          error: APIError.INVALID_REQUEST,
        };
        res.status(406).json(response);
        return;
      }

      const size = parseInt(sizeString);

      if (isNaN(size) || size < 1) {
        const response:APIResponse = {
          success: false,
          error: APIError.INVALID_REQUEST,
        };
        res.status(406).json(response);
        return;
      }

      if (size > maxUploadFileSize) {
        const response:APIResponse = {
          success: false,
          error: APIError.RESOURCE_EXCEEDS_FILE_SIZE,
        };
        res.status(406).json(response);
        return;
      }

      const mimeType = req.headers["content-type"];

      if (!mimeType) {
        const response:APIResponse = {
          success: false,
          error: APIError.INVALID_REQUEST,
        };
        res.status(406).json(response);
        return;
      }

      try {
        logger.verbose("Starting file upload. Type: " + mimeType);
        //console.log(req)

        const {fileId, size: transmittedBytes} = await Notes.addFile(
          graphId,
          // @ts-ignore
          req,
          mimeType,
        );

        logger.verbose(
          `Expected size: ${size} Transmitted: ${transmittedBytes}`,
        );
        if (size !== transmittedBytes) {
          /* this looks like the request was not completed. we'll remove the
          file */
          logger.verbose("Removing file due to incomplete upload");
          await Notes.deleteFile(graphId, fileId);

          const response:APIResponse = {
            success: false,
            error: APIError.INVALID_REQUEST,
          };
          res.status(406).json(response);
          return;
        }
        const response:APIResponse = {
          success: true,
          payload: {
            fileId,
            size,
          },
        };
        res.json(response);
      } catch (e) {
        logger.verbose("Catched an error trying to upload a file:");
        logger.verbose(e);
        const response:APIResponse = {
          success: false,
          error: APIError.NOTES_APPLICATION_ERROR,
          errorMessage: e instanceof Error ? e.message : "Unknown notes module error",
        };
        res.status(406).json(response);
      }
    },
  );


  app.get(
    // the public name parameter is optionally given but is not used by the API.
    // it's only there for the browser to save/display the file with a custom
    // name with a url like
    // /api/file/ae62787f-4344-4124-8026-3839543fde70.png/my-pic.png
    config.GRAPH_ENDPOINT + "file/:fileId/:publicName*?",
    sessionMiddleware,
    verifyUser,
    async function(req, res) {
      try {
        const graphId = req.params.graphId;

        /** Calculate Size of file */
        const size = await Notes.getFileSize(graphId, req.params.fileId);
        const range = req.headers.range;

        /** Check for Range header */
        if (range) {
          /** Extracting Start and End value from Range Header */
          const [startString, endString] = range.replace(/bytes=/, "")
            .split("-");

          let start = parseInt(startString, 10);
          let end = endString ? parseInt(endString, 10) : size - 1;

          if (!isNaN(start) && isNaN(end)) {
            // eslint-disable-next-line no-self-assign
            start = start;
            end = size - 1;
          }
          if (isNaN(start) && !isNaN(end)) {
            start = size - end;
            end = size - 1;
          }

          // Handle unavailable range request
          if (start >= size || end >= size) {
            // Return the 416 Range Not Satisfiable.
            res.writeHead(416, {
              "Content-Range": `bytes */${size}`
            });
            return res.end();
          }

          const { readable, mimeType }
            = await Notes.getReadableFileStream(
              graphId,
              req.params.fileId,
              { start: start, end: end },
            );

          readable.on("error", () => {
            const response:APIResponse = {
              success: false,
              error: APIError.FILE_NOT_FOUND,
            };
            res.json(response);
          });

          /** Sending Partial Content With HTTP Code 206 */
          res.writeHead(206, {
            "Content-Range": `bytes ${start}-${end}/${size}`,
            "Accept-Ranges": "bytes",
            "Content-Length": end - start + 1,
            "Content-Type": mimeType,
          });

          readable.pipe(res);

        } else { // no range request
          const { readable, mimeType }
            = await Notes.getReadableFileStream(graphId, req.params.fileId);

          readable.on("error", () => {
            const response:APIResponse = {
              success: false,
              error: APIError.FILE_NOT_FOUND,
            };
            res.json(response);
          });

          res.writeHead(200, {
            "Content-Length": size,
            "Content-Type": mimeType
          });

          readable.pipe(res);
        }
      } catch (e) {
        const response:APIResponse = {
          success: false,
          error: APIError.NOTES_APPLICATION_ERROR,
          errorMessage: e instanceof Error ? e.message : "Unknown notes module error",
        };
        res.json(response);
      }
    },
  );


  app.get(
    config.GRAPH_ENDPOINT + "files",
    sessionMiddleware,
    verifyUser,
    express.json(),
    handleJSONParseErrors,
    async function(req, res) {
      const graphId = req.params.graphId;
      const files = await Notes.getFiles(graphId);

      const response:APIResponse = {
        payload: files,
        success: true,
      };
      res.json(response);
    },
  );


  app.delete(
    config.GRAPH_ENDPOINT + "file/:fileId",
    sessionMiddleware,
    verifyUser,
    express.json(),
    handleJSONParseErrors,
    async function(req, res) {
      const graphId = req.params.graphId;
      const fileId = req.params.fileId;
      try {
        await Notes.deleteFile(graphId, fileId);
        const response:APIResponse = {
          payload: fileId,
          success: true,
        };
        res.json(response);
      } catch (e) {
        const response:APIResponse = {
          success: false,
          error: APIError.NOTES_APPLICATION_ERROR,
          errorMessage: e instanceof Error ? e.message : "Unknown notes module error",
        };
        res.json(response);
      }
    },
  );


  app.get(
    config.GRAPH_ENDPOINT + "dangling-files",
    sessionMiddleware,
    verifyUser,
    express.json(),
    handleJSONParseErrors,
    async function(req, res) {
      const graphId = req.params.graphId;
      const files = await Notes.getDanglingFiles(graphId);

      const response:APIResponse = {
        payload: files,
        success: true,
      };
      res.json(response);
    },
  );


  app.get(
    config.GRAPH_ENDPOINT + "url-metadata",
    sessionMiddleware,
    verifyUser,
    async (req, res) => {
      const url = req.query.url;

      try {
        const metadata = await Notes.getUrlMetadata(url as string);
        const response:APIResponse = {
          success: true,
          payload: metadata,
        };
        res.json(response);
      } catch (e) {
        logger.verbose("Error while getting URL metadata");
        logger.verbose(JSON.stringify(e));
        const response:APIResponse = {
          "success": false,
          error: APIError.NOTES_APPLICATION_ERROR,
          errorMessage: e instanceof Error ? e.message : "Unknown notes module error",
        };
        res.json(response);
      }
    },
  );


  app.put(
    config.GRAPH_ENDPOINT + "pins",
    sessionMiddleware,
    verifyUser,
    express.json(),
    handleJSONParseErrors,
    async function(req, res) {
      const graphId = req.params.graphId;
      const reqBody = req.body;
      const noteId = reqBody.noteId;

      const pinnedNotes = await Notes.pin(graphId, noteId);

      const response:APIResponse = {
        payload: pinnedNotes,
        success: true,
      };
      res.json(response);
    },
  );


  app.delete(
    config.GRAPH_ENDPOINT + "pins",
    sessionMiddleware,
    verifyUser,
    express.json(),
    handleJSONParseErrors,
    async function(req, res) {
      const graphId = req.params.graphId;
      const reqBody = req.body;
      const noteId = reqBody.noteId;

      const pinnedNotes = await Notes.unpin(graphId, noteId);

      const response:APIResponse = {
        payload: pinnedNotes,
        success: true,
      };
      res.json(response);
    },
  );


  app.get(
    config.GRAPH_ENDPOINT + "pins",
    sessionMiddleware,
    verifyUser,
    express.json(),
    handleJSONParseErrors,
    async function(req, res) {
      const graphId = req.params.graphId;
      const pinnedNotes = await Notes.getPins(graphId);

      const response:APIResponse = {
        payload: pinnedNotes,
        success: true,
      };
      res.json(response);
    },
  );

  app.post(
    config.USER_ENDOPINT + "logout",
    sessionMiddleware,
    verifyUser,
    express.json(),
    handleJSONParseErrors,
    async function(req, res) {
      const response:APIResponse = {
        success: true,
      };

      logger.verbose(`Logout: ${req.userId}`);

      await new Promise((resolve, reject) => {
        req.session.destroy(function(err) {
          if (err) {
            reject(err);
          } else {
            resolve(null);
          }
        });
      });

      return res
        .status(200)
        .clearCookie(
          sessionCookieName,
        )
        .json(response);
    },
  );

  /* ***************
    Endpoints with NO authentication required
  *****************/


  app.get(config.API_PATH, function(_req, res) {
    const response:APIResponse = {
      success: true,
      payload: "Hello world!",
    };
    res.json(response);
  });


  const handleUnsuccessfulLoginAttempt = (req, res) => {
    logger.verbose("Unsuccessful login attempt");
    logger.verbose(`User: ${req.body.username}`);
    logger.verbose(`Password: ${req.body.password}`);
    logger.verbose(`MFA Token: ${req.body.mfaToken}`);
    logger.verbose(`IP: ${req.socket.remoteAddress}`);

    bruteForcePreventer.unsuccessfulLogin(req.socket.remoteAddress);

    const response:APIResponse = {
      success: false,
      error: APIError.INVALID_CREDENTIALS,
    };
    return res.status(401).json(response);
  };


  app.post(
    config.USER_ENDOPINT + 'login',
    sessionMiddleware,
    express.json(),
    handleJSONParseErrors,
    (req, res) => {
      const remoteAddress = req.socket.remoteAddress;
      // remote address may be undefined if the client has disconnected
      if (typeof remoteAddress !== "string") {
        return;
      }

      if (!bruteForcePreventer.isLoginAttemptLegit(remoteAddress)) {
        logger.verbose(
          `Login request denied due to brute force prevention. IP: ${remoteAddress}`
        );

        const response:APIResponse = {
          success: false,
          error: APIError.TOO_EARLY,
        };
        return res.status(425).json(response);
      }

      // read username and password from request body
      const submittedUsername = req.body.username;
      const submittedPassword = req.body.password;
      const submittedMfaToken = req.body.mfaToken;

      if (
        (!submittedUsername)
        || (!submittedPassword)
        || (!submittedMfaToken)
      ) {
        return handleUnsuccessfulLoginAttempt(req, res);
      }

      const user = users.find((user) => {
        return user.login === submittedUsername;
      });

      if (!user) {
        return handleUnsuccessfulLoginAttempt(req, res);
      }

      const mfaTokenIsValid
        = twofactor.verifyToken(
          user.mfaSecret,
          submittedMfaToken,
        )?.delta === 0;

      if (!mfaTokenIsValid) {
        return handleUnsuccessfulLoginAttempt(req, res);
      }

      const passwordIsValid
        = bcrypt.compareSync(submittedPassword, user.passwordHash);

      if (!passwordIsValid) {
        return handleUnsuccessfulLoginAttempt(req, res);
      }

      // this modification of the session object initializes the session and
      // makes express-session set the cookie
      req.session.userId = user.id;
      req.session.userAgent = req.headers["user-agent"];
      req.session.userPlatform = req.headers["sec-ch-ua-platform"];

      logger.verbose(
        `Successful login: ${req.session.userId} IP: ${remoteAddress}`,
      );
      bruteForcePreventer.successfulLogin(remoteAddress);

      const response:APIResponse = {
        success: true,
        payload: {
          graphIds: user.graphIds,
        },
      };

      return res.status(200).json(response);
    },
  );


  app.use(
    historyAPIFallback(
      'index.html',
      {
        root: path.resolve(frontendPath),
      },
    ),
  );

  app.use((_req, res:Response) => {
    res.status(404).end("Not found");
  });

  return app;
};

export default startApp;
