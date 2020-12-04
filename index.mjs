import * as path from "path";
import express from "express";
import * as Notes from "./lib/notes.mjs";
import urlMetadata from "url-metadata";
import formidable from "formidable";
import fs from "fs";
import archiver from "archiver";
import { getNoteTitle } from "./lib/noteUtils.mjs";
import { yyyymmdd } from "./lib/utils.mjs";
import * as url from "url";
import mkdirp from "mkdirp";
import compression from "compression";

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const app = express();

let PORT = 8080;
const API_PATH = "/api";

let DATA_PATH = path.join(__dirname, "..", "network-notes-data");
if (process.env.DATA_FOLDER_PATH) {
  DATA_PATH = process.env.DATA_FOLDER_PATH;
}

// passwords and usernames must not contain colons
let users;
const usersFile = path.join(DATA_PATH, "users.json");
if (fs.existsSync(usersFile)) {
  console.log("Loading existing users file...");
  const json = fs.readFileSync(usersFile);
  users = JSON.parse(json);
} else {
  const defaultUsers = [
    { id: "admin", login: "admin", password: "0000" },
  ];
  console.log("No users file found. Creating one by myself...");
  mkdirp.sync(DATA_PATH);
  fs.writeFileSync(usersFile, JSON.stringify(defaultUsers));
  users = defaultUsers;
}

const ALLOWED_IMAGE_UPLOAD_TYPES = [
  {
    mimeType: "image/png",
    ending: "png",
  },
  {
    mimeType: "image/jpeg",
    ending: "jpg",
  },
  {
    mimeType: "image/webp",
    ending: "webp",
  },
];


const ALLOWED_FILE_UPLOAD_TYPES = [
  {
    mimeType: "application/pdf",
    ending: "pdf",
  },
];


const customPortArgument = process.argv.find((arg) => {
  return arg.startsWith("port=");
});

if (customPortArgument) {
  PORT = parseInt(customPortArgument.substring(5));
}

Notes.init(DATA_PATH);

app.use((req, res, next) => {
  // -----------------------------------------------------------------------
  // authentication middleware

  // parse login and password from headers
  const b64auth = (req.headers.authorization || "").split(" ")[1] || "";
  const [login, password]
    = Buffer.from(b64auth, "base64").toString().split(":");

  const validUser = users.find((user) => {
    return user.login === login && user.password === password;
  });

  // Verify login and password are set and correct
  if (login && password && validUser) {
    req.userId = validUser.id;
    // Access granted...
    return next();
  }

  // Access denied...
  res.set("WWW-Authenticate", "Basic realm=\"401\""); // change this
  res.status(401).send("Authentication required."); // custom message

  // -----------------------------------------------------------------------
});

app.use("/", express.static(path.join(__dirname, "frontend")));
app.use(express.json());
app.use(compression());

app.get(API_PATH, function(req, res) {
  res.send("Hello World!");
});


app.get(API_PATH + "/database-with-uploads", function(req, res) {
  const archive = archiver("zip");

  archive.on("error", function(err) {
    res.status(500).send({ error: err.message });
  });

  // on stream closed we can end the request
  archive.on("end", function() {
    console.log("Archive wrote %d bytes", archive.pointer());
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


app.get(API_PATH + "/database", function(req, res) {
  const database = Notes.exportDB(req.userId);
  res.end(JSON.stringify(database));
});


app.put(API_PATH + "/database", function(req, res) {
  Notes.importDB(req.body, req.userId);
  res.end(JSON.stringify(
    {
      success: true,
    },
  ));
});


app.get(API_PATH + "/graph", function(req, res) {
  const graph = Notes.getGraph(req.userId);
  res.end(JSON.stringify(graph));
});


app.get(API_PATH + "/stats", function(req, res) {
  const graph = Notes.getGraph(req.userId);

  const numberOfUnlinkedNotes = graph.nodes.filter((note) => {
    return note.linkedNotes.length === 0;
  }).length;

  const stats = {
    numberOfAllNotes: graph.nodes.length,
    numberOfLinks: graph.links.length,
    numberOfUnlinkedNotes,
  };
  res.end(JSON.stringify(stats));
});


app.post(API_PATH + "/graph", function(req, res) {
  Notes.setGraph(req.body, req.userId);
  res.end(JSON.stringify(
    {
      success: true,
    },
  ));
});


app.get(API_PATH + "/notes", function(req, res) {
  const query = req.query.q;
  const caseSensitiveQuery = req.query.caseSensitive === "true";
  const includeLinkedNotes = true;

  let notes;

  if (typeof query === "string" && query.length < 3) {
    notes = [];
  } else {
    notes = Notes.getAll(req.userId, {
      includeLinkedNotes,
      query,
      caseSensitiveQuery,
    });
  }


  const notesList = notes.map((note) => {
    const noteCleaned = {
      id: note.id,
      title: getNoteTitle(note),
      creationTime: note.creationTime,
      updateTime: note.updateTime,
    };

    if (includeLinkedNotes) {
      noteCleaned.numberOfLinkedNotes = note.linkedNotes.length;
    }

    return noteCleaned;
  });

  const response = {
    success: true,
    notes: notesList,
  };

  res.end(JSON.stringify(response));
});


app.get(API_PATH + "/note/:noteId", function(req, res) {
  const note = Notes.get(parseInt(req.params.noteId), req.userId, true);
  res.end(JSON.stringify(note));
});


app.put(API_PATH + "/note", function(req, res) {
  const reqBody = req.body;
  try {
    const noteFromDB = Notes.put(reqBody.note, req.userId, reqBody.options);
    res.end(JSON.stringify({
      note: noteFromDB,
      success: true,
    }));
  } catch (e) {
    res.end(JSON.stringify({
      success: false,
      error: e.message,
    }));
  }
});


app.put(API_PATH + "/import-links-as-notes", function(req, res) {
  const reqBody = req.body;
  const links = reqBody.links;
  Promise.allSettled(links.map((url) => {
    return getUrlMetadata(url);
  }))
    .then((responses) => {
      const urlMetadataObjects = responses
        .filter((response) => {
          return response.status === "fulfilled";
        })
        .map((response) => {
          return response.value;
        });

      const notes = urlMetadataObjects.map((urlMetadataObject) => {
        const newNoteObject = {
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

        return newNoteObject;
      });

      const notesFromDB = [];
      const failures = [];

      notes.forEach((note) => {
        try {
          const noteFromDB = Notes.put(note, req.userId, {
            ignoreDuplicateTitles: true,
          });
          notesFromDB.push(noteFromDB);
        } catch (e) {
          failures.push({
            note,
            error: e,
          });
        }
      });

      res.end(JSON.stringify({
        notesFromDB,
        failures,
        success: true,
      }));
    });
});


app.delete(API_PATH + "/note/:noteId", function(req, res) {
  const success = Notes.remove(parseInt(req.params.noteId), req.userId);
  res.end(JSON.stringify({
    success,
  }));
});


app.listen(PORT, function() {
  console.log("Ready on port " + PORT);
});


const getUrlMetadata = async (url) => {
  const metadata = await urlMetadata(url);

  const response = {
    "success": 1,
    "url": url,
    "meta": {
      "title": metadata.title,
      "description": metadata.description,
      "image": {
        "url": metadata.image,
      },
    },
  };

  return response;
};


app.get(API_PATH + "/link-data", (req, res) => {
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


app.post(API_PATH + "/image", function(req, res) {
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

    const fileTypeObject = ALLOWED_IMAGE_UPLOAD_TYPES.find((filetype) => {
      return filetype.mimeType === file.type;
    });

    if (!fileTypeObject) {
      console.log("Invalid MIME type: " + file.type);
      res.end("Invalid MIME type: " + file.type);
      return;
    }

    const oldpath = file.path;
    const fileId = Notes.addFile(oldpath, fileTypeObject);

    res.end(JSON.stringify(
      {
        "success": 1,
        "file": {
          "url": API_PATH + "/file/" + fileId,
          "fileId": fileId,
        },
      },
    ));
  });
});


app.post(API_PATH + "/file", function(req, res) {
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

    const fileTypeObject = ALLOWED_FILE_UPLOAD_TYPES.find((filetype) => {
      return filetype.mimeType === file.type;
    });

    if (!fileTypeObject) {
      console.log("Invalid MIME type: " + file.type);
      res.end("Invalid MIME type: " + file.type);
      return;
    }

    const oldpath = file.path;
    const fileId = Notes.addFile(oldpath, fileTypeObject);

    res.end(JSON.stringify(
      {
        "success": 1,
        "file": {
          "url": API_PATH + "/file/" + fileId,
          "size": file.size,
          "name": file.name,
          "fileId": fileId,
        },
      },
    ));
  });
});


app.get(API_PATH + "/file/:fileId", function(req, res) {
  const file = Notes.getFile(req.params.fileId);
  if (!fs.existsSync(file)) {
    res.end("ERROR: File does not exist!");
    return;
  }
  res.download(file);
});

