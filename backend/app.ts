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

const startApp = ({
  users,
  dataPath,
  frontendPath,
  jwtSecret,
}) => {
  Notes.init(dataPath);
  const app = express();

  const authenticateJWT = (req, res, next) => {
    // skip authentication when not acessing API
    if (!req.path.startsWith(config.API_PATH)) {
      return next();
    }

    // allow to login without token
    if (req.path.startsWith(config.API_PATH + "login")) {
      return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).send({ error: "INVALID_CREDENTIALS" });
    }

    const token = authHeader.split(' ')[1];

    jwt.verify(token, jwtSecret, (err, jwtPayload) => {
      if (err) {
        return res.status(403).send({ error: "INVALID_CREDENTIALS" });
      }

      req.userId = jwtPayload.userId;
      return next();
    });

  };

  app.use(authenticateJWT);
  app.use("/", express.static(frontendPath));
  app.use(express.json());
  app.use(compression());


  app.get(config.API_PATH, function(req, res) {
    res.send("Hello World!");
  });


  app.post(config.API_PATH + 'login', (req, res) => {
    // read username and password from request body
    const submittedUsername = req.body.username;
    const submittedPassword = req.body.password;

    if ((!submittedUsername) || (!submittedPassword)) {
      // Access denied...
      res.status(401).send({ error: "INVALID_CREDENTIALS" });
      return;
    }

    const user = users.find((user) => {
      return user.login === submittedUsername;
    });

    if (!user) {
      // Access denied...
      res.status(401).send({ error: "INVALID_CREDENTIALS" });
      return;
    }

    const passwordIsValid
      = bcrypt.compareSync(submittedPassword, user.passwordHash);

    if (!passwordIsValid) {
      // Access denied...
      res.status(401).send({ error: "INVALID_CREDENTIALS" });
      return;
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

    res.end(JSON.stringify({
      success: true,
      token: accessToken,
    }));
  });

  app.get(config.API_PATH + "database-with-uploads", function(req, res) {
    const archive = archiver("zip");

    archive.on("error", function(err) {
      res.status(500).send({ error: err.message });
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
  });


  app.get(config.API_PATH + "database", function(req, res) {
    const database = Notes.exportDB(req.userId);
    res.end(JSON.stringify(database));
  });


  app.put(config.API_PATH + "database", function(req, res) {
    try {
      const success = Notes.importDB(req.body, req.userId);
      res.end(JSON.stringify(
        {
          success,
        },
      ));
    } catch(e) {
      res.end(JSON.stringify(
        {
          success: false,
          error: e.message
        },
      ));
    }
  });


  app.get(config.API_PATH + "graph", function(req, res) {
    const graph = Notes.getGraph(req.userId);
    res.end(JSON.stringify(graph));
  });


  app.get(config.API_PATH + "stats", function(req, res) {
    const stats:Stats = Notes.getStats(req.userId);
    res.end(JSON.stringify(stats));
  });


  app.post(config.API_PATH + "graph", function(req, res) {
    const success = Notes.setGraph(req.body, req.userId);

    res.end(JSON.stringify({
      success,
    }));
  });


  app.get(config.API_PATH + "notes", function(req, res) {
    const query = req.query.q || "";
    const caseSensitiveQuery = req.query.caseSensitive === "true";
    const includeLinkedNotes = true;

    const notesList:NoteListItem[] = Notes.getNotesList(req.userId, {
      includeLinkedNotes,
      query,
      caseSensitiveQuery,
    });

    const response = {
      success: true,
      notes: notesList,
    };

    res.end(JSON.stringify(response));
  });


  app.get(config.API_PATH + "note/:noteId", function(req, res) {
    const noteId:NoteId = parseInt(req.params.noteId);
    const note:NoteToTransmit | null = Notes.get(noteId, req.userId);
    res.end(JSON.stringify(note));
  });


  app.put(config.API_PATH + "note", function(req, res) {
    const reqBody = req.body;
    try {
      const noteToTransmit:NoteToTransmit
        = Notes.put(reqBody.note, req.userId, reqBody.options);

      res.end(JSON.stringify({
        note: noteToTransmit,
        success: true,
      }));
    } catch (e) {
      res.end(JSON.stringify({
        success: false,
        error: e.message,
      }));
    }
  });


  app.put(config.API_PATH + "import-links-as-notes", function(req, res) {
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

        res.end(JSON.stringify({
          notesToTransmit,
          failures,
          success: true,
        }));
      });
  });


  app.delete(config.API_PATH + "note/:noteId", function(req, res) {
    const success = Notes.remove(parseInt(req.params.noteId), req.userId);
    res.end(JSON.stringify({
      success,
    }));
  });


  app.get(config.API_PATH + "link-data", (req, res) => {
    const url = req.query.url;

    getUrlMetadata(url)
      .then((metadata) => {
        res.end(JSON.stringify(metadata));
      })
      .catch((e) => {
        const response = {
          "success": 0,
          "error": e,
        };
        res.end(JSON.stringify(response));
      });
  });


  app.post(config.API_PATH + "image", function(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.log(err);
        res.end(err);
        return;
      }

      const file = files.image;

      if (!file) {
        res.end("File upload error");
        return;
      }

      const fileTypeObject = config.ALLOWED_IMAGE_UPLOAD_TYPES.find(
        (filetype) => {
          return filetype.mimeType === file.type;
        },
      );

      if (!fileTypeObject) {
        res.end("Invalid MIME type: " + file.type);
        return;
      }

      const oldpath = file.path;
      const fileId = Notes.addFile(oldpath, fileTypeObject);

      res.end(JSON.stringify(
        {
          "success": 1,
          "file": {
            "url": config.API_PATH + "file/" + fileId,
            "fileId": fileId,
          },
        },
      ));
    });
  });


  app.post(config.API_PATH + "file", function(req, res) {
    const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.log(err);
        res.end(err);
        return;
      }

      const file = files.file;

      if (!file) {
        res.end("File upload error");
        return;
      }

      const fileTypeObject = config.ALLOWED_FILE_UPLOAD_TYPES.find((filetype) => {
        return filetype.mimeType === file.type;
      });

      if (!fileTypeObject) {
        res.end("Invalid MIME type: " + file.type);
        return;
      }

      const oldpath = file.path;
      const fileId = Notes.addFile(oldpath, fileTypeObject);

      res.end(JSON.stringify(
        {
          "success": 1,
          "file": {
            "url": config.API_PATH + "file/" + fileId,
            "size": file.size,
            "name": file.name,
            "fileId": fileId,
          },
        },
      ));
    });
  });


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
