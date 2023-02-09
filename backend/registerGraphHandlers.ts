import NoteToTransmit from "../lib/notes/interfaces/NoteToTransmit.js";
import { NoteId } from "../lib/notes/interfaces/NoteId.js";
import Stats, { GraphSize } from "../lib/notes/interfaces/GraphStats.js";
import { yyyymmdd } from "../lib/utils.js";
import NoteListPage from "../lib/notes/interfaces/NoteListPage.js";
import { NoteListSortMode } from "../lib/notes/interfaces/NoteListSortMode.js";
import GraphStatsRetrievalOptions from "../lib/notes/interfaces/GraphStatsRetrievalOptions.js";
import GraphVisualizationFromUser from "../lib/notes/interfaces/GraphVisualizationFromUser.js";
import GraphObject from "../lib/notes/interfaces/Graph.js";
import { NoteSaveRequest } from "../lib/notes/interfaces/NoteSaveRequest.js";
import MimeTypes from "../lib/MimeTypes.js";
import Ajv from "ajv";
import noteSaveRequestSchema from "../lib/notes/schemas/NoteSaveRequest.schema.json" assert { type: 'json' };
import graphObjectSchema from "../lib/notes/schemas/GraphObject.schema.json" assert { type: 'json' };
import graphVisualizationFromUserSchema from "../lib/notes/schemas/GraphVisualizationFromUser.schema.json" assert { type: 'json' };
import * as config from "./config.js";
import express from "express";
import * as Notes from "../lib/notes/index.js";
import APIResponse from "./interfaces/APIResponse.js";
import { APIError } from "./interfaces/APIError.js";
import * as logger from "./lib/logger.js";


export default (
  app,
  sessionMiddleware,
  verifyUser,
  handleJSONParseErrors,
  maxUploadFileSize,
  maxGraphSize,
) => {
  const ajv = new Ajv();

  const validateNoteSaveRequest = ajv.compile(noteSaveRequestSchema);
  const validateGraphVisualizationFromUser = ajv.compile(graphVisualizationFromUserSchema);
  const validateGraphObject = ajv.compile(graphObjectSchema);

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
};
