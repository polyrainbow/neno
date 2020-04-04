const path = require("path");
const express = require("express");
const app = express();
const Notes = require("./lib/notes.js");
const urlMetadata = require("url-metadata");
const formidable = require("formidable");
const fs = require("fs");


let PORT = 8080;
let DATA_PATH = path.join(__dirname, "..", "network-notes-data");

// passwords and usernames must not contain colons
const users = [
  { id: "sebastian", login: "sebastian", password: "9575" },
  { id: "sophia", login: "sophia", password: "kuss" },
];

const ALLOWED_UPLOAD_TYPES = [
  {
    mimeType: "image/png",
    ending: "png",
  },
  {
    mimeType: "image/jpeg",
    ending: "jpg",
  },
];

const customPortArgument = process.argv.find((arg) => {
  return arg.startsWith("port=");
});

if (customPortArgument) {
  PORT = parseInt(customPortArgument.substring(5));
}

if (process.env.DATA_FOLDER_PATH) {
  DATA_PATH = process.env.DATA_FOLDER_PATH;
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

app.use("/", express.static(path.join(__dirname, "static")));
app.use(express.json());

app.get("/api", function(req, res) {
  res.send("Hello World!");
});


app.get("/api/database", function(req, res) {
  const database = Notes.exportDB(req.userId);
  res.end(JSON.stringify(database));
});


app.put("/api/database", function(req, res) {
  Notes.importDB(req.body, req.userId);
  res.end(JSON.stringify(
    {
      success: true,
    },
  ));
});


app.get("/api/graph", function(req, res) {
  const graph = Notes.getGraph(req.userId);
  res.end(JSON.stringify(graph));
});


app.post("/api/graph", function(req, res) {
  Notes.setGraph(req.body, req.userId);
  res.end(JSON.stringify(
    {
      success: true,
    },
  ));
});


app.get("/api/notes", function(req, res) {
  const notes = Notes.getAll(req.userId, true);
  const notesList = notes.map((note) => {
    return {
      id: note.id,
      title: note.editorData && note.editorData.blocks[0].data.text,
      time: note.time,
      numberOfLinkedNotes: note.linkedNotes.length,
    };
  });
  res.end(JSON.stringify(notesList));
});


app.get("/api/note/:noteId", function(req, res) {
  const note = Notes.get(parseInt(req.params.noteId), req.userId, true);
  res.end(JSON.stringify(note));
});


app.put("/api/note", function(req, res) {
  const note = req.body;
  const noteFromDB = Notes.put(note, req.userId);
  res.end(JSON.stringify({
    note: noteFromDB,
    success: true,
  }));
});


app.delete("/api/note/:noteId", function(req, res) {
  const success = Notes.remove(parseInt(req.params.noteId), req.userId);
  res.end(JSON.stringify({
    success,
  }));
});


app.listen(PORT, function() {
  console.log("Ready on port " + PORT);
});


app.get("/api/link-data", (req, res) => {
  const url = req.query.url;

  urlMetadata(url)
    .then((metadata) => {
      const response = {
        "success": 1,
        "meta": {
          "title": metadata.title,
          "description": metadata.description,
          "image": {
            "url": metadata.image,
          },
        },
      };
      res.end(JSON.stringify(response));
    })
    .catch((e) => {
      const response = {
        "success": 0,
        "error": e,
      };
      res.end(JSON.stringify(response));
    });
});


app.post("/api/image", function(req, res) {
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

    const fileTypeObject = ALLOWED_UPLOAD_TYPES.find((filetype) => {
      return filetype.mimeType === file.type;
    });

    if (!fileTypeObject) {
      console.log("Invalid MIME type: " + file.type);
      res.end("Invalid MIME type: " + file.type);
      return;
    }

    const oldpath = files.image.path;
    const imageId = Notes.addImage(oldpath, fileTypeObject);

    res.end(JSON.stringify(
      {
        "success": 1,
        "file": {
          "url": "/api/image/" + imageId,
          "imageId": imageId,
        },
      },
    ));
  });
});


app.get("/api/image/:imageId", function(req, res) {
  const file = Notes.getImage(req.params.imageId);
  if (!fs.existsSync(file)) {
    res.end("ERROR: File does not exist!");
    return;
  }
  res.download(file);
});

