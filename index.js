const path = require("path");
const express = require("express");
const app = express();
const Notes = require("./notes.js");
const urlMetadata = require("url-metadata");

let PORT = 8080;

const customPortArgument = process.argv.find((arg) => {
  return arg.startsWith("port=");
});

if (customPortArgument) {
  PORT = parseInt(customPortArgument.substring(5));
}

Notes.init(
  process.env.DATA_FOLDER_PATH
  || path.join(__dirname, "..", "network-notes-data"),
);

app.use((req, res, next) => {
  // -----------------------------------------------------------------------
  // authentication middleware

  const users = [
    { id: "sebastian", login: "sebastian", password: "9575" },
    { id: "sophia", login: "sophia", password: ":-*" },
  ];

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
  const success = Notes.remove(req.params.noteId, req.userId);
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
      console.log(metadata);
    })
    .catch((e) => {
      const response = {
        "success": 0,
        "error": e,
      };
      res.end(JSON.stringify(response));
    });
});
