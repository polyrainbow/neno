import NoteToTransmit from "../lib/notes/interfaces/NoteToTransmit.js";
import { NoteId } from "../lib/notes/interfaces/NoteId.js";
import Stats, { GraphSize } from "../lib/notes/interfaces/GraphStats.js";
import { yyyymmdd } from "../lib/utils.js";
import * as config from "./config.js";
import compression from "compression";
import express, { Response } from "express";
import * as Notes from "../lib/notes/index.js";
import APIResponse from "./interfaces/APIResponse.js";
import { APIError } from "./interfaces/APIError.js";
import cookieParser from "cookie-parser";
import AppStartOptions from "./interfaces/AppStartOptions.js";
import NoteListPage from "../lib/notes/interfaces/NoteListPage.js";
import FileSystemStorageProvider from "./lib/FileSystemStorageProvider.js";
import historyAPIFallback from "./lib/HistoryAPIFallback.js";
import * as path from "path";
import session from "express-session";
import User from "./interfaces/User.js";
import { createHash, randomUUID } from "crypto";
import FileSessionStore from "./lib/FileSessionStore.js";
import * as logger from "./lib/logger.js";
import { NoteListSortMode } from "../lib/notes/interfaces/NoteListSortMode.js";
import { UserId } from "./interfaces/UserId.js";
import { GraphId } from "../lib/notes/interfaces/GraphId";
import BruteForcePreventer from "./BruteForcePreventer.js";
import GraphStatsRetrievalOptions from "../lib/notes/interfaces/GraphStatsRetrievalOptions.js";
import Ajv from "ajv";
import noteSaveRequestSchema from "../lib/notes/schemas/NoteSaveRequest.schema.json" assert { type: 'json' };
import graphObjectSchema from "../lib/notes/schemas/GraphObject.schema.json" assert { type: 'json' };
import graphVisualizationFromUserSchema from "../lib/notes/schemas/GraphVisualizationFromUser.schema.json" assert { type: 'json' };
import GraphVisualizationFromUser from "../lib/notes/interfaces/GraphVisualizationFromUser.js";
import GraphObject from "../lib/notes/interfaces/Graph.js";
import getDocumentTitle from "./lib/getDocumentTitle.js";
import { NoteSaveRequest } from "../lib/notes/interfaces/NoteSaveRequest.js";
import MimeTypes from "../lib/MimeTypes.js";
import * as Users from "./Users.js";
import { ExpectedAssertionResult, ExpectedAttestationResult, Fido2Lib } from "fido2-lib";
import { toArrayBuffer } from "./lib/utils.js";

const startApp = async ({
  dataPath,
  frontendPath,
  sessionSecret,
  sessionTTL,
  maxUploadFileSize,
  sessionCookieName,
  maxGraphSize,
}: AppStartOptions): Promise<Express.Application> => {
  Users.init(dataPath);
  const graphsDirectoryPath = path.join(dataPath, config.GRAPHS_DIRECTORY_NAME);
  const storageProvider = new FileSystemStorageProvider(graphsDirectoryPath);
  logger.info("File system storage ready at " + graphsDirectoryPath);
  logger.info("Session TTL: " + sessionTTL.toString() + " day(s)");
  logger.info(
    "Maximum upload file size: " + maxUploadFileSize.toString() + " byte(s)",
  );
  logger.info("Initializing notes module...");
  await Notes.init(storageProvider, randomUUID);

  const f2l = new Fido2Lib({
    timeout: 60,
    rpId: "localhost",
    rpName: "NENO",
    rpIcon: "http://localhost:8080/assets/app-icon/logo.svg",
    challengeSize: 128,
    attestation: "none",
    cryptoParams: [-7, -257],
    authenticatorAttachment: "platform",
    authenticatorRequireResidentKey: false,
    authenticatorUserVerification: "required"
  });

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

  const validateNoteSaveRequest = ajv.compile(noteSaveRequestSchema);
  const validateGraphVisualizationFromUser = ajv.compile(graphVisualizationFromUserSchema);
  const validateGraphObject = ajv.compile(graphObjectSchema);

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


  const verifyUser = async (req, res, next) => {
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


  /* ***************
    Endpoints
  *****************/

  /* ***************
    Endpoints with authentication required
  *****************/

  app.post(
    config.USER_ENDOPINT + "authenticated",
    sessionMiddleware,
    verifyUser,
    async function(req, res) {
      const response: APIResponse = {
        success: true,
        payload: {
          graphIds: await getGraphIdsForUser(req.userId),
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

          const response: APIResponse = {
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
        const response: APIResponse = {
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
        const response: APIResponse = {
          success: false,
          error: APIError.INVALID_REQUEST,
        };
        res.json(response);
        return;
      }
      
      const response: APIResponse = {
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
      const response: APIResponse = {
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
      const options: GraphStatsRetrievalOptions = {
        includeMetadata: req.query.includeMetadata === "true",
        includeAnalysis: req.query.includeAnalysis === "true",
      };
      const stats: Stats = await Notes.getStats(graphId, options);
      const response: APIResponse = {
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
        const response: APIResponse = {
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
        const response: APIResponse = {
          success: true,
        };
        res.json(response);
      } catch (e) {
        const response: APIResponse = {
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

      const notesListPage: NoteListPage = await Notes.getNotesList(
        graphId,
        {
          searchString,
          caseSensitive,
          page,
          sortMode,
          limit,
        },
      );

      const response: APIResponse = {
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
      const noteIdParam = req.params.noteId;
      const noteId: NoteId | "random" = noteIdParam === "random"
        ? "random"
        : parseInt(noteIdParam);

      try {
        const note: NoteToTransmit = await Notes.get(noteId, graphId);
        const response: APIResponse = {
          success: true,
          payload: note,
        };
        res.json(response);
      } catch (e) {
        const response: APIResponse = {
          success: false,
          error: APIError.NOTES_APPLICATION_ERROR,
          errorMessage: e instanceof Error ? e.message : "Unknown notes module error",
        };
        res.json(response);
      }
    },
  );


  app.get(
    config.GRAPH_ENDPOINT + "note-raw/:noteId",
    sessionMiddleware,
    verifyUser,
    async function(req, res) {
      const graphId = req.params.graphId;
      const noteId: NoteId = parseInt(req.params.noteId);

      try {
        const note: string = await Notes.getRawNote(noteId, graphId);
        const response: APIResponse = {
          success: true,
          payload: note,
        };
        res.json(response);
      } catch (e) {
        const response: APIResponse = {
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
      const noteSaveRequest = reqBody;

      const isValid = validateNoteSaveRequest(noteSaveRequest);

      if (!isValid) {
        const response: APIResponse = {
          success: false,
          error: APIError.INVALID_REQUEST,
        };
        res.json(response);
        return;
      }

      try {
        const noteToTransmit: NoteToTransmit = await Notes.put(
          noteSaveRequest as unknown as NoteSaveRequest,
          graphId,
        );

        const response: APIResponse = {
          success: true,
          payload: noteToTransmit,
        };
        res.json(response);
      } catch (e) {
        const response: APIResponse = {
          success: false,
          error: APIError.NOTES_APPLICATION_ERROR,
          errorMessage: e instanceof Error ? e.message : "Unknown notes module error",
        };
        res.json(response);
      }
    },
  );


  app.put(
    config.GRAPH_ENDPOINT + "raw-note",
    sessionMiddleware,
    verifyUser,
    express.json(),
    handleJSONParseErrors,
    async function(req, res) {
      const graphId = req.params.graphId;
      const reqBody = req.body;
      const rawNote = reqBody.note;

      try {
        const noteToTransmit: NoteToTransmit = await Notes.putRawNote(
          rawNote,
          graphId,
        );

        const response: APIResponse = {
          success: true,
          payload: noteToTransmit,
        };
        res.json(response);
      } catch (e) {
        const response: APIResponse = {
          success: false,
          error: APIError.NOTES_APPLICATION_ERROR,
          errorMessage: e instanceof Error ? e.message : "Unknown notes module error",
        };
        res.json(response);
      }
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
        const response: APIResponse = {
          success: true,
        };
        res.json(response);
      } catch (e) {
        const response: APIResponse = {
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
        const response: APIResponse = {
          success: false,
          error: APIError.INVALID_REQUEST,
        };
        res.status(406).json(response);
        return;
      }

      const fileSize = parseInt(sizeString);

      if (isNaN(fileSize) || fileSize < 1) {
        const response: APIResponse = {
          success: false,
          error: APIError.INVALID_REQUEST,
        };
        res.status(406).json(response);
        return;
      }

      if (fileSize > maxUploadFileSize) {
        const response: APIResponse = {
          success: false,
          error: APIError.RESOURCE_EXCEEDS_MAX_FILE_SIZE,
        };
        res.status(406).json(response);
        return;
      }

      const stats = await Notes.getStats(graphId, {
        includeMetadata: true,
        includeAnalysis: false,
      });

      const graphSize = stats.size as GraphSize;
      const currentGraphSize = graphSize.graph + graphSize.files;

      if ((currentGraphSize + fileSize) > maxGraphSize) {
        const response: APIResponse = {
          success: false,
          error: APIError.MAX_GRAPH_SIZE_REACHED,
        };
        res.status(406).json(response);
        return;
      }

      const contentType = req.headers["content-type"];

      if (contentType !== "application/neno-filestream") {
        const response: APIResponse = {
          success: false,
          error: APIError.INVALID_REQUEST,
        };
        res.status(406).json(response);
        return;
      }

      const filenameBase64 = req.headers["filename"];

      if (typeof filenameBase64 !== "string" || (filenameBase64.length === 0)) {
        const response: APIResponse = {
          success: false,
          error: APIError.INVALID_REQUEST,
        };
        res.status(406).json(response);
        return;
      }

      const filename = Buffer.from(filenameBase64, "base64").toString();

      try {
        logger.verbose("Starting file upload. Name: " + filename);

        const {
          name,
          fileId,
          size: transmittedBytes,
        } = await Notes.addFile(
          graphId,
          req,
          filename,
        );

        logger.verbose(
          `Expected size: ${fileSize} Transmitted: ${transmittedBytes}`,
        );
        if (fileSize !== transmittedBytes) {
          /* this looks like the request was not completed. we'll remove the
          file */
          logger.verbose("Removing file due to incomplete upload");
          await Notes.deleteFile(graphId, fileId);

          const response: APIResponse = {
            success: false,
            error: APIError.INVALID_REQUEST,
          };
          res.status(406).json(response);
          return;
        }
        const response: APIResponse = {
          success: true,
          payload: {
            fileId,
            size: fileSize,
            name,
          },
        };
        res.json(response);
      } catch (e) {
        logger.verbose("Catched an error trying to upload a file:");
        logger.verbose(e);
        const response: APIResponse = {
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

        const { size } = await Notes.getFileInfo(graphId, req.params.fileId);
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

          const readable
            = await Notes.getReadableFileStream(
              graphId,
              req.params.fileId,
              { start: start, end: end },
            );

          readable.on("error", () => {
            const response: APIResponse = {
              success: false,
              error: APIError.FILE_NOT_FOUND,
            };
            res.json(response);
          });

          const extension = Notes.utils.getExtensionFromFilename(req.params.fileId);

          // https://nodejs.org/en/knowledge/advanced/streams/how-to-use-fs-create-read-stream/
          readable.on("open", () => {
            /** Sending Partial Content With HTTP Code 206 */
            res.writeHead(206, {
              "Content-Range": `bytes ${start}-${end}/${size}`,
              "Accept-Ranges": "bytes",
              "Content-Length": end - start + 1,
              "Content-Type": extension && MimeTypes.has(extension)
                ? MimeTypes.get(extension) as string
                : "application/neno-filestream",
            });

            readable.pipe(res);
          });
        } else { // no range request
          const readable
            = await Notes.getReadableFileStream(graphId, req.params.fileId);

          readable.on("error", () => {
            const response: APIResponse = {
              success: false,
              error: APIError.FILE_NOT_FOUND,
            };
            res.status(404).json(response);
          });

          const extension = Notes.utils.getExtensionFromFilename(req.params.fileId);

          // https://nodejs.org/en/knowledge/advanced/streams/how-to-use-fs-create-read-stream/
          readable.on("open", () => {
            res.writeHead(200, {
              "Content-Length": size,
              "Content-Type": extension && MimeTypes.has(extension)
                ? MimeTypes.get(extension) as string
                : "application/neno-filestream",
            });
  
            readable.pipe(res);
          });
        }
      } catch (e) {
        const response: APIResponse = {
          success: false,
          error: APIError.NOTES_APPLICATION_ERROR,
          errorMessage: e instanceof Error ? e.message : "Unknown notes module error",
        };
        res.json(response);
      }
    },
  );


  app.get(
    config.GRAPH_ENDPOINT + "file-info/:fileId",
    sessionMiddleware,
    verifyUser,
    express.json(),
    handleJSONParseErrors,
    async function(req, res) {
      const graphId = req.params.graphId;
      const fileId = req.params.fileId;
      try {
        const file = await Notes.getFileInfo(graphId, fileId);

        const response: APIResponse = {
          payload: file,
          success: true,
        };
        res.json(response);
      } catch (e) {
        const response: APIResponse = {
          error: APIError.NOTES_APPLICATION_ERROR,
          errorMessage: e instanceof Error ? e.message : "Unknown notes module error",
          success: false,
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

      const response: APIResponse = {
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
        const response: APIResponse = {
          payload: fileId,
          success: true,
        };
        res.json(response);
      } catch (e) {
        const response: APIResponse = {
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

      const response: APIResponse = {
        payload: files,
        success: true,
      };
      res.json(response);
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

      const response: APIResponse = {
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

      const response: APIResponse = {
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

      const response: APIResponse = {
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
      const response: APIResponse = {
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

  /* ***************
    Endpoints with NO authentication required
  *****************/


  app.get(config.API_PATH, function(_req, res) {
    const response: APIResponse = {
      success: true,
      payload: "Hello world!",
    };
    res.json(response);
  });


  const handleUnsuccessfulLoginAttempt = (req, res) => {
    logger.verbose("Unsuccessful login attempt");
    logger.verbose(`User: ${req.body.username}`);
    logger.verbose(`IP: ${req.socket.remoteAddress}`);

    bruteForcePreventer.unsuccessfulLogin(req.socket.remoteAddress);

    const response: APIResponse = {
      success: false,
      error: APIError.INVALID_CREDENTIALS,
    };
    return res.status(401).json(response);
  };


  enum LoginRequestType {
    REQUEST_CHALLENGE = "REQUEST_CHALLENGE",
    SUBMIT_ASSERTION = "SUBMIT_ASSERTION",
  }


  app.post(
    config.USER_ENDOPINT + 'login',
    sessionMiddleware,
    express.json(),
    handleJSONParseErrors,
    async (req, res) => {
      const remoteAddress = req.socket.remoteAddress;
      // remote address may be undefined if the client has disconnected
      if (typeof remoteAddress !== "string") {
        return;
      }

      const type = req.body.type as LoginRequestType;

      if (!bruteForcePreventer.isLoginAttemptLegit(remoteAddress)) {
        logger.verbose(
          `Login request denied due to brute force prevention. IP: ${remoteAddress}`
        );

        const response: APIResponse = {
          success: false,
          error: APIError.TOO_EARLY,
        };
        return res.status(425).json(response);
      }

      if (type === LoginRequestType.REQUEST_CHALLENGE) {
        const authnOptions = await f2l.assertionOptions();

        // this modification of the session object initializes the session and
        // makes express-session set the cookie
        req.session.userAgent = req.headers["user-agent"];
        req.session.userPlatform = req.headers["sec-ch-ua-platform"];
        req.session.challenge = Buffer.from(authnOptions.challenge).toString("base64url");

        const response: APIResponse = {
          success: true,
          payload: {
            authnOptions: {
              ...authnOptions,
              challenge: Buffer.from(authnOptions.challenge).toString("base64url"),
            },
          },
        };
  
        return res.status(200).json(response);
      } else if (type === LoginRequestType.SUBMIT_ASSERTION) {
        const clientResponse = req.body.response;

        const userId = Buffer.from(clientResponse.userHandle, "base64url")
          .toString();

        const user = await Users.find((user) => {
          return user.id === userId;
        });

        if (!user) {
          return handleUnsuccessfulLoginAttempt(req, res);
        }

        const clientAssertionResponse = {
          rawId: toArrayBuffer(Buffer.from(req.body.rawId, "base64url")),
          response: {
            signature: clientResponse.signature,
            clientDataJSON: clientResponse.clientDataJSON,
            authenticatorData: clientResponse.authenticatorData,
          },
        };

        for (let i = 0; i < user.credentials.length; i++) {
          const assertionExpectations: ExpectedAssertionResult = {
            challenge: req.session.challenge,
            origin: "http://localhost:8080",
            factor: "either",
            publicKey: user.credentials[i].pubKey,
            prevCounter: user.credentials[i].prevCounter,
            userHandle: null,
          };
        
          try {
            await f2l.assertionResult(
              clientAssertionResponse,
              assertionExpectations,
            );

            req.session.userId = user.id;
            req.session.challenge = null;
            req.session.loggedIn = true;
        
            bruteForcePreventer.successfulLogin(remoteAddress);

            const response: APIResponse = {
              success: true,
              payload: {
                graphIds: user.graphIds,
              },
            };
      
            return res.status(200).json(response);
          } catch (e) {
            continue;
          }
        }

        const response: APIResponse = {
          success: false,
          error: APIError.INVALID_REQUEST,
        };

        return res.status(406).json(response);
      }
    },
  );


  enum RegisterRequestType {
    REQUEST_CHALLENGE = "REQUEST_CHALLENGE",
    SUBMIT_PUBLIC_KEY = "SUBMIT_PUBLIC_KEY",
  }

  /*
    this register handler handles WebAuthn registration requests.
    this is a 4-step process:

    1. client calls this endpoint with a registration request and a
    sign-up token (type="request-challenge")
    2. server recognizes that the sign-up token is associated with a certain
    user and sends a webauthn challenge to the client:
    "You want to register your device for user Alice, so please create a public
    key with this challenge."
    3. client creates credentials and sends public key to server
      (type="submit-public-key")
    4. server saves public key.
  */
  app.post(
    config.USER_ENDOPINT + 'register',
    sessionMiddleware,
    express.json(),
    handleJSONParseErrors,
    async (req, res) => {
      const type = req.body.type as RegisterRequestType;

      const remoteAddress = req.socket.remoteAddress;
      // remote address may be undefined if the client has disconnected
      if (typeof remoteAddress !== "string") {
        return;
      }

      if (!bruteForcePreventer.isLoginAttemptLegit(remoteAddress)) {
        logger.verbose(
          `Login request denied due to brute force prevention. IP: ${remoteAddress}`
        );

        const response: APIResponse = {
          success: false,
          error: APIError.TOO_EARLY,
        };
        return res.status(425).json(response);
      }

      if (type === RegisterRequestType.REQUEST_CHALLENGE) {
        const signUpToken = req.body.signUpToken;

        if (!signUpToken) {
          bruteForcePreventer.unsuccessfulLogin(req.socket.remoteAddress);

          const response: APIResponse = {
            success: false,
            error: APIError.INVALID_CREDENTIALS,
          };

          return res.status(401).json(response);
        }

        const user = await Users.find((user) => {
          return user.signUpTokens.includes(signUpToken);
        });

        if (!user) {
          bruteForcePreventer.unsuccessfulLogin(req.socket.remoteAddress);

          const response: APIResponse = {
            success: false,
            error: APIError.INVALID_CREDENTIALS,
          };

          return res.status(401).json(response);
        }

        const registrationOptions = await f2l.attestationOptions();
        registrationOptions.user.id = user.id;
        registrationOptions.user.name = user.name;
        registrationOptions.user.displayName = user.name;

        // this modification of the session object initializes the session and
        // makes express-session set the cookie
        req.session.userId = user.id;
        req.session.userAgent = req.headers["user-agent"];
        req.session.userPlatform = req.headers["sec-ch-ua-platform"];
        req.session.challenge = Buffer.from(registrationOptions.challenge).toString("base64url");
        req.session.loggedIn = false;

        const response: APIResponse = {
          success: true,
          payload: {
            registrationOptions: {
              ...registrationOptions,
              challenge: Buffer.from(registrationOptions.challenge).toString("base64url"),
            },
          },
        };

        return res.status(200).json(response);
      } else if (type === RegisterRequestType.SUBMIT_PUBLIC_KEY) {
        if (typeof req.body.clientDataJSON !== "string") return;
        if (typeof req.body.attestationObject !== "string") return;
  
        const challenge = req.session.challenge;

        const attestationExpectations: ExpectedAttestationResult = {
          challenge,
          origin: "http://localhost:8080",
          factor: "either"
        };

        const attestationResult = {
          rawId: toArrayBuffer(Buffer.from(req.body.rawId, "base64url")),
          response: {
            clientDataJSON: req.body.clientDataJSON as string,
            attestationObject: req.body.attestationObject as string,
          },
        };

        try {
          const regResult = await f2l.attestationResult(
            attestationResult,
            attestationExpectations,
          );

          req.session.challenge = null;
          req.session.loggedIn = true;

          logger.verbose(
            `Successful login: ${req.session.userId} IP: ${remoteAddress}`,
          );
          bruteForcePreventer.successfulLogin(remoteAddress);

          const user = await Users.find((user) => {
            return user.id === req.session.userId;
          });

          if (!user) {
            bruteForcePreventer.unsuccessfulLogin(req.socket.remoteAddress);
  
            const response: APIResponse = {
              success: false,
              error: APIError.INVALID_CREDENTIALS,
            };
  
            return res.status(401).json(response);
          }

          Users.addCredentials(
            user.id,
            {
              pubKey: regResult.authnrData.get("credentialPublicKeyPem"),
              prevCounter: 0,
            },
          );

          const response: APIResponse = {
            success: true,
            payload: {
              graphIds: user.graphIds,
            },
          };
  
          return res.status(200).json(response);
        } catch (e) {
          const response: APIResponse = {
            success: false,
            error: APIError.INVALID_REQUEST,
          };

          await new Promise((resolve, reject) => {
            req.session.destroy(function(err) {
              if (err) {
                reject(err);
              } else {
                resolve(null);
              }
            });
          });
    
          return res.status(406)
            .clearCookie(
              sessionCookieName,
            )
            .json(response);
        }
      } else {
        const response: APIResponse = {
          success: false,
          error: APIError.INVALID_REQUEST,
        };

        await new Promise((resolve, reject) => {
          req.session.destroy(function(err) {
            if (err) {
              reject(err);
            } else {
              resolve(null);
            }
          });
        });
  
        return res.status(406)
          .clearCookie(
            sessionCookieName,
          )
          .json(response);
      }
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

  app.use((_req, res: Response) => {
    res.status(404).end("Not found");
  });

  return app;
};

export default startApp;
