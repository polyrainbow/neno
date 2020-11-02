import React, { useEffect, useState } from "react";
import Header from "./Header.js";
import Controls from "./Controls.js";
import NotesList from "./NotesList.js";
import Note from "./Note.js";
import * as Utils from "./lib/utils.js";
import * as Config from "./lib/config.js";
import * as API from "./lib/api.js";
import * as Editor from "./lib/editor.js";

const App = () => {
  const [notes, setNotes] = useState(null);
  const [links, setLinks] = useState(null);
  const [activeNote, setActiveNote] = useState(null);

  const loadNote = async (noteId) => {
    if (typeof noteId !== "number") {
      setActiveNote(null);
      return;
    }

    const note = await API.getNote(noteId);
    setActiveNote(note);
  };


  const refreshNotesList = async () => {
    const notes = await API.getNotes();
    setNotes(notes);
  };


  const removeActiveNote = async () => {
    if (activeNote === null) {
      return;
    }

    await API.deleteNote(activeNote.id);
    loadNote(null);
    refreshNotesList();
  };

  const createNewNote = () => {
    loadNote();
    refreshNotesList();
  };


  const saveNote = async () => {
    const outputData = await Editor.save();

    let note = {
      editorData: outputData,
    };

    if (
      typeof activeNote === "object"
      && activeNote !== null
    ) {
      note = {
        ...activeNote,
        ...note,
      };

      if (note.linkedNotes) {
        delete note.linkedNotes;
      }
    }

    // if the note has no title yet, take the title of the link metadata
    const firstLinkBlock = note.editorData.blocks.find(
      (block) => block.type === "linkTool",
    );

    if (
      note.editorData.blocks[0].data.text === Config.DEFAULT_NOTE_TITLE
      && firstLinkBlock
      && typeof firstLinkBlock.data.meta.title === "string"
      && firstLinkBlock.data.meta.title.length > 0
    ) {
      note.editorData.blocks[0].data.text = firstLinkBlock.data.meta.title;
    }

    try {
      const noteFromServer = await API.putNote(note);
      setActiveNote(noteFromServer);
      refreshNotesList();
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log("Saving failed: ", e);
    }
  };


  useEffect(() => {
    const initialId = parseInt(
      Utils.getParameterByName("id", window.location.href),
    );
    if (initialId) {
      loadNote(initialId);
    }

    refreshNotesList();

    API.getGraph()
      .then((graph) => setLinks(graph.links))
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error("Could not get graph via API.");
        // eslint-disable-next-line no-console
        console.error(e);
      });
  }, []);


  return <>
    <Header
      notes={notes}
      links={links}
      activeNote={activeNote}
    />
    <Controls
      activeNote={activeNote}
      createNewNote={createNewNote}
      saveNote={saveNote}
      removeActiveNote={removeActiveNote}
    />
    <main>
      <NotesList
        notes={notes}
        loadNote={loadNote}
        activeNote={activeNote}
      />
      <Note
        note={activeNote}
        loadNote={loadNote}
      />
    </main>
  </>;
};

export default App;
