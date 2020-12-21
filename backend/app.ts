import NoteListItem from "./interfaces/NoteListItem.js";
import NoteToTransmit from "./interfaces/NoteToTransmit.js";
import { NoteId } from "./interfaces/NoteId.js";
import Stats from "./interfaces/Stats.js";
import getUrlMetadata from "./lib/getUrlMetadata.js";
import formidable from "formidable";
import { yyyymmdd } from "./lib/utils.js";
import * as config from "./config.js";
import compression from "compression";
import express from "express";
import fs from "fs";
import * as Notes from "./lib/notes.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import APIResponse from "./interfaces/APIResponse.js";
import { APIError } from "./interfaces/APIError.js";
import { File } from "./interfaces/File.js";

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
    config.API_PATH + "database",
    verifyJWT,
    function(req, res) {
      const withUploads = req.query.withUploads === "true";

      const databaseStream = Notes.getReadableDatabaseStream(
        req.userId,
        withUploads,
      );

      // set the archive name
      const dateSuffix = yyyymmdd(new Date());

      const fileEnding = withUploads ? "zip" : "json";
      const filename = `neno-${req.userId}-${dateSuffix}.db.${fileEnding}`;
      res.attachment(filename);

      // this is the streaming magic
      databaseStream.pipe(res);
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

      Notes.importLinksAsNotes(req.userId, links)
        .then((result) => {
          const response:APIResponse = {
            payload: result,
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
    function(req, res) {
      const form = new formidable.IncomingForm();
      form.parse(req, (err, fields, files) => {
        if (err) {
          console.log("error")
          console.log(err);
          const response:APIResponse = {
            success: false,
            error: APIError.INTERNAL_SERVER_ERROR,
          };
          res.status(500).json(response);
          return;
        }

        const file:File = files.file;

        if (!file) {
          const response:APIResponse = {
            success: false,
            error: APIError.INVALID_REQUEST,
          };
          res.status(406).json(response);
          return;
        }

        try {
          const fileId = Notes.addFile(file);

          const response:APIResponse = {
            success: true,
            payload: fileId,
          };
          res.json(response);
        } catch (e) {
          const response:APIResponse = {
            success: false,
            error: e.message,
          };
          res.json(response);
        }

      });
    },
  );


  // currently returns a custom response style required by the editor.js
  // link plugin
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


  // TO BE IMPROVED
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
