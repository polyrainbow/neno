import NoteListItem from "./interfaces/NoteListItem.js";
import NoteToTransmit from "./interfaces/NoteToTransmit.js";
import { NoteId } from "./interfaces/NoteId.js";
import UrlMetadataResponse from "./interfaces/UrlMetadataResponse.js";
import NoteFromUser from "./interfaces/NoteFromUser.js";
import Stats from "./interfaces/Stats.js";
import * as Utils from "./lib/utils.js";
import ImportLinkAsNoteFailure from "./interfaces/ImportLinkAsNoteFailure.js";
import getUrlMetadata from "./lib/getUrlMetadata.js";
import formidable from "formidable";
import archiver from "archiver";
import { yyyymmdd } from "./lib/utils.js";
import * as config from "./config.js";
import compression from "compression";
import express from "express";
import fs from "fs";
import * as path from "path";
import * as Notes from "./lib/notes.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import APIResponse from "./interfaces/APIResponse.js";
import { APIError } from "./interfaces/APIError.js";

const startApp = ({
  users,
  dataPath,
  frontendPath,
  jwtSecret,
}) => {
  Notes.init(dataPath);
  const app = express();

  const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      const response:APIResponse = {
        success: false,
        error: APIError.INVALID_CREDENTIALS,
      };
      return res.status(401).json(response);
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, jwtSecret, (err, jwtPayload) => {
      if (err) {
        const response:APIResponse = {
          success: false,
          error: APIError.INVALID_CREDENTIALS,
        };
        return res.status(403).json(response);
      }

      req.userId = jwtPayload.userId;
      return next();
    });

  };

  app.use("/", express.static(frontendPath));
  app.use(compression());


  /* ***************
    Endpoints
  *****************/

  /* ***************
    Endpoints with authentication required
  *****************/


  app.get(
    config.API_PATH + "database-with-uploads",
    verifyJWT,
    function(req, res) {
      const archive = archiver("zip");

      archive.on("error", function(err) {
        const response:APIResponse = {
          success: false,
          error: err.message,
        }
        res.status(500).json(response);
      });

      // on stream closed we can end the request
      archive.on("end", function() {
        const size = archive.pointer();
        console.log(`Archive for ${req.userId} created. Size: ${size} bytes`);
      });

      // set the archive name
      const dateSuffix = yyyymmdd(new Date());
      res.attachment(`neno-${req.userId}-${dateSuffix}.db.zip`);

      // this is the streaming magic
      archive.pipe(res);

      Notes
        .getFilesForDBExport(req.userId)
        .forEach((file) => {
          archive.file(file, { name: path.basename(file) });
        });

      archive.finalize();
    },
  );


  app.get(
    config.API_PATH + "database",
    verifyJWT,
    function(req, res) {
      const database = Notes.exportDB(req.userId);
      res.end(JSON.stringify(database));
    },
  );


  app.put(
    config.API_PATH + "database",
    verifyJWT,
    express.json(),
    function(req, res) {
      const response:APIResponse = {
        success: false,
      };
    
      try {
        const success = Notes.importDB(req.body, req.userId);
        if (!success) throw new Error("INTERNAL_SERVER_ERROR");
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
    config.API_PATH + "graph",
    verifyJWT,
    function(req, res) {
      const graph = Notes.getGraph(req.userId);
      const response:APIResponse = {
        success: true,
        payload: graph,
      };
      res.json(response);
    },
  );


  app.get(
    config.API_PATH + "stats",
    verifyJWT,
    function(req, res) {
      const stats:Stats = Notes.getStats(req.userId);
      const response:APIResponse = {
        success: true,
        payload: stats,
      };
      res.json(response);
    },
  );


  app.post(
    config.API_PATH + "graph",
    verifyJWT,
    express.json(),
    function(req, res) {
      const success = Notes.setGraph(req.body, req.userId);
      const response:APIResponse = {
        success,
      };
      if (!success) {
        response.error = APIError.INTERNAL_SERVER_ERROR;
      }
      res.json(response);
    },
  );


  app.get(
    config.API_PATH + "notes",
    verifyJWT,
    function(req, res) {
      const query = req.query.q || "";
      const caseSensitiveQuery = req.query.caseSensitive === "true";
      const includeLinkedNotes = true;

      const notesList:NoteListItem[] = Notes.getNotesList(req.userId, {
        includeLinkedNotes,
        query,
        caseSensitiveQuery,
      });

      const response:APIResponse = {
        success: true,
        payload: notesList,
      };
      res.json(response);
    },
  );


  app.get(
    config.API_PATH + "note/:noteId",
    verifyJWT,
    function(req, res) {
      const noteId:NoteId = parseInt(req.params.noteId);
      const note:NoteToTransmit | null = Notes.get(noteId, req.userId);
      const response:APIResponse = {
        success: !!note,
        payload: note,
      };
      if (!note) {
        response.error = APIError.NOTE_NOT_FOUND;
      }
      res.json(response);
    },
  );


  app.put(
    config.API_PATH + "note",
    verifyJWT,
    express.json(),
    function(req, res) {
      const reqBody = req.body;
      try {
        const noteToTransmit:NoteToTransmit
          = Notes.put(reqBody.note, req.userId, reqBody.options);

        const response:APIResponse = {
          success: true,
          payload: noteToTransmit,
        };
        res.json(response);
      } catch (e) {
        const response:APIResponse = {
          success: false,
          error: e.message,
        };
        res.json(response);
      }
    },
  );


  app.put(
    config.API_PATH + "import-links-as-notes",
    verifyJWT,
    express.json(),
    function(req, res) {
      const reqBody = req.body;
      const links:string[] = reqBody.links;
      const promises:Promise<UrlMetadataResponse>[]
        = links.map((url:string):Promise<UrlMetadataResponse> => {
          return getUrlMetadata(url);
        });

      Promise.allSettled(promises)
        .then((promiseSettledResults):void => {
          const fulfilledPromises:PromiseSettledResult<UrlMetadataResponse>[]
            = promiseSettledResults.filter((response) => {
              return response.status === "fulfilled";
            });
          
          const urlMetadataResults:UrlMetadataResponse[]
            = fulfilledPromises.map((response) => {
              return (response.status === "fulfilled") && response.value;
            })
            .filter(Utils.isNotFalse);

          const notesFromUser:NoteFromUser[]
            = urlMetadataResults.map((urlMetadataObject) => {
            const noteFromUser:NoteFromUser = {
              editorData: {
                "time": Date.now(),
                "blocks": [
                  {
                    "type": "header",
                    "data": {
                      "text": urlMetadataObject.meta.title,
                      "level": 1,
                    },
                  },
                  {
                    "type": "linkTool",
                    "data": {
                      "link": urlMetadataObject.url,
                      "meta": urlMetadataObject.meta,
                    },
                  },
                ],
                "version": "2.16.1",
              },
            };

            return noteFromUser;
          });

          const notesToTransmit:NoteToTransmit[] = [];
          const failures:ImportLinkAsNoteFailure[] = [];

          notesFromUser.forEach((noteFromUser:NoteFromUser) => {
            try {
              const noteToTransmit:NoteToTransmit = Notes.put(
                noteFromUser,
                req.userId,
                {
                  ignoreDuplicateTitles: true,
                },
              );
              notesToTransmit.push(noteToTransmit);
            } catch (e) {
              const errorMessage:string = e.toString();
              const failure:ImportLinkAsNoteFailure = {
                note: noteFromUser,
                error: errorMessage,
              };
              failures.push(failure);
            }
          });

          const response:APIResponse = {
            payload: {
              notesToTransmit,
              failures,
            },
            success: true,
          };
          res.json(response);
        });
    },
  );


  app.delete(
    config.API_PATH + "note/:noteId",
    verifyJWT,
    function(req, res) {
      const success = Notes.remove(parseInt(req.params.noteId), req.userId);
      const response:APIResponse = {
        success,
      };
      res.json(response);
    },
  );


  app.post(
    config.API_PATH + "file",
    verifyJWT,
    function(req, res) { console.log("incoming file");
      const form = new formidable.IncomingForm();
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.log("error")
          console.log(err);
          res.end(err);
          return;
        }

        const file = files.file;

        if (!file) {
          res.end("File upload error");
          return;
        }

        const fileTypeObject = config.ALLOWED_FILE_UPLOAD_TYPES
          .find((filetype) => {
            return filetype.mimeType === file.type;
          });

        if (!fileTypeObject) {
          res.end("Invalid MIME type: " + file.type);
          return;
        }

        const oldpath = file.path;
        const fileId = Notes.addFile(oldpath, fileTypeObject);

        // this is the response style required by the editor.js attaches plugin
        res.json(
          {
            "success": 1,
            "file": {
              "url": config.API_PATH + "file/" + fileId,
              "size": file.size,
              "name": file.name,
              "fileId": fileId,
            },
          },
        );
      });
    },
  );


  app.get(
    config.API_PATH + "link-data",
    verifyJWT,
    (req, res) => {
      const url = req.query.url;

      getUrlMetadata(url)
        .then((metadata) => {
          res.end(JSON.stringify(metadata));
        })
        .catch((e) => {
          // this is the response style required by the editor.js link plugin
          const response = {
            "success": 0,
            "error": e,
          };
          res.json(response);
        });
    },
  );


  /* ***************
    Endpoints with NO authentication required
  *****************/


  app.get(config.API_PATH, function(req, res) {
    const response:APIResponse = {
      success: true,
      payload: "Hello world!",
    }
    res.json(response);
  });


  app.post(
    config.API_PATH + 'login',
    express.json(),
    (req, res) => {
      // read username and password from request body
      const submittedUsername = req.body.username;
      const submittedPassword = req.body.password;

      if ((!submittedUsername) || (!submittedPassword)) {
        // Access denied...
        const response:APIResponse = {
          success: false,
          error: APIError.INVALID_CREDENTIALS,
        };
        return res.status(401).json(response);
      }

      const user = users.find((user) => {
        return user.login === submittedUsername;
      });

      if (!user) {
        // Access denied...
        const response:APIResponse = {
          success: false,
          error: APIError.INVALID_CREDENTIALS,
        };
        return res.status(401).json(response);
      }

      const passwordIsValid
        = bcrypt.compareSync(submittedPassword, user.passwordHash);

      if (!passwordIsValid) {
        // Access denied...
        const response:APIResponse = {
          success: false,
          error: APIError.INVALID_CREDENTIALS,
        };
        return res.status(401).json(response);
      }

      // generate an access token
      const accessToken = jwt.sign(
        {
          userLogin: user.login,
          userId: user.id,
        },
        jwtSecret,
        { expiresIn: '10d' }
      );

      const response:APIResponse = {
        success: true,
        token: accessToken,
      };

      return res.status(200).json(response);
    },
  );


  app.get(config.API_PATH + "file/:fileId", function(req, res) {
    const file = Notes.getFile(req.params.fileId);
    if (!fs.existsSync(file)) {
      res.end("ERROR: File does not exist!");
      return;
    }
    res.download(file);
  });


  return app;
};

export default startApp;
