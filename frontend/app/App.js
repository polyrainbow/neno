import React, { useEffect, useState, useCallback } from "react";
import Header from "./Header.js";
import NoteControls from "./NoteControls.js";
import NotesList from "./NotesList.js";
import NoteSearchInput from "./NoteSearchInput.js";
import Note from "./Note.js";
import * as Utils from "./lib/utils.js";
import * as Config from "./lib/config.js";
import * as API from "./lib/api.js";
import * as Editor from "./lib/editor.js";

const App = () => {
  const [displayedNotes, setDisplayedNotes] = useState(null);
  const [allNotes, setAllNotes] = useState(null);
  const [links, setLinks] = useState(null);
  const [activeNote, setActiveNote] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  const handleSearchInputChange = (value) => {
    setSearchValue(value);
    refreshNotesList();
  };

  const loadNote = async (noteId) => {
    if (typeof noteId !== "number") {
      setActiveNote(null);
      return;
    }

    const note = await API.getNote(noteId);
    setActiveNote(note);
  };


  const refreshNotesList = useCallback(
    async () => {
      const options = {};
      if (searchValue.length > 0) {
        options.query = searchValue;
        options.caseSensitive = false;
      }
      const notes = await API.getNotes(options);
      setDisplayedNotes(notes);

      const allNotes = (searchValue.length === 0)
        ? notes
        : await API.getNotes();

      setAllNotes(allNotes);
    },
    [searchValue],
  );


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


  const saveNote = async (options) => {
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

    const noteFromServer = await API.putNote(note, options);
    setActiveNote(noteFromServer);
    refreshNotesList();
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
  }, [refreshNotesList]);


  return <>
    <Header
      allNotes={allNotes}
      links={links}
    />
    <main>
      <div id="left-view">
        <NoteSearchInput
          onChange={handleSearchInputChange}
          value={searchValue}
        />
        <NotesList
          notes={displayedNotes}
          loadNote={loadNote}
          activeNote={activeNote}
        />
      </div>
      <div id="right-view">
        <NoteControls
          activeNote={activeNote}
          createNewNote={createNewNote}
          saveNote={saveNote}
          removeActiveNote={removeActiveNote}
        />
        <Note
          note={activeNote}
          loadNote={loadNote}
        />
      </div>

    </main>
  </>;
};

export default App;
