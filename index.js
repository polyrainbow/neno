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
  const notesList = notes.map((note) => {
    return {
      id: note.id,
      title: note.editorData.blocks[0].data.text,
    };
  });
  res.end(JSON.stringify(notesList));
});


app.get("/api/note/:noteId", function(req, res) {
  const note = Notes.get(req.params.noteId);
  res.end(JSON.stringify(note));
});


app.put("/api/note", function(req, res) {
  console.log(req);
  const note = req.body; console.log(req.body);
  if (note.id) {
    const updatedNote = Notes.update(note);
    res.end(JSON.stringify({
      noteId: updatedNote.id,
      success: true,
    }));
    console.log("Note updated: " + updatedNote.id);
  } else {
    const noteFromDB = Notes.create(note);
    res.end(JSON.stringify({
      noteId: noteFromDB.id,
      success: true,
    }));
    console.log("Note created: " + noteFromDB.id);
  }
});


app.delete("/api/note/:noteId", function(req, res) {
  const success = Notes.remove(req.params.noteId);
  res.end(JSON.stringify({
    success,
  }));
});


app.listen(PORT, function() {
  console.log("Ready!");
});
