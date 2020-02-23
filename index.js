const path = require("path");
const express = require("express");
const app = express();
const Notes = require("./notes.js");

const PORT = 8080;

app.use("/", express.static(path.join(__dirname, "static")));
app.use(express.json());

app.get("/api", function(req, res) {
  if (req.method === "GET") {
    res.send("Hello World!");
  }
});


app.get("/api/notes", function(req, res) {
  const notes = Notes.getAll();
  res.end(JSON.stringify(notes));
});


app.get("/api/note/:noteId", function(req, res) {
  const note = Notes.get(req.params.noteId);
  res.end(JSON.stringify(note));
});


app.put("/api/note", function(req, res) {
  console.log(req);
  const note = req.body; console.log(req.body);
  const noteId = Notes.create(note);
  res.end(JSON.stringify({
    noteId,
    success: true,
  }));
  console.log("Note created: " + noteId);
});


app.put("/api/note/:noteId", function(req, res) {
  const note = req.body;
  const updatedNote = Notes.update(req.params.noteId, note);
  res.end(JSON.stringify(updatedNote));
});


app.delete("/api/note/:noteId", function(req, res) {
  const success = Notes.delete(req.params.noteId);
  res.end(JSON.stringify({
    success,
  }));
});


app.listen(PORT, function() {
  console.log("Ready!");
});
