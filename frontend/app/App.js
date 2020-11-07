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

const getNewNoteObject = () => {
  return {
    isUnsaved: true,
    changes: [],
  };
};

const App = () => {
  const [displayedNotes, setDisplayedNotes] = useState(null);
  const [allNotes, setAllNotes] = useState(null);
  const [links, setLinks] = useState(null);
  const [activeNote, setActiveNote] = useState(getNewNoteObject());
  const [searchValue, setSearchValue] = useState("");
  const displayedLinkedNotes = [
    ...(!activeNote.isUnsaved)
      ? activeNote.linkedNotes.filter((note) => {
        const isRemoved = activeNote.changes.some((change) => {
          return (
            change.type === "LINKED_NOTE_DELETED"
            && change.noteId === note.id
          );
        });
        return !isRemoved;
      })
      : [],
    ...activeNote.changes
      .filter((change) => {
        return change.type === "LINKED_NOTE_ADDED";
      })
      .map((change) => {
        return allNotes.find((note) => {
          return note.id === change.noteId;
        });
      }),
  ];

  const handleSearchInputChange = (value) => {
    setSearchValue(value);
    refreshNotesList();
  };

  const handleLinkAddition = (note) => {
    if (activeNote.changes.some((change) => {
      return (
        change.type === "LINKED_NOTE_ADDED"
        && change.noteId === note.id
      );
    })) {
      return;
    }

    setActiveNote({
      ...activeNote,
      changes: [
        ...activeNote.changes.filter((change) => {
          return !(
            change.type === "LINKED_NOTE_DELETED"
            && change.noteId === note.id
          );
        }),
        {
          type: "LINKED_NOTE_ADDED",
          noteId: note.id,
        },
      ],
    });
  };


  const handleLinkRemoval = (linkedNoteId) => {
    if (activeNote.changes.some((change) => {
      return (
        change.type === "LINKED_NOTE_DELETED"
        && change.noteId === linkedNoteId
      );
    })) {
      return;
    }

    setActiveNote({
      ...activeNote,
      changes: [
        ...activeNote.changes.filter((change) => {
          return !(
            change.type === "LINKED_NOTE_ADDED"
            && change.noteId === linkedNoteId
          );
        }),
        {
          type: "LINKED_NOTE_DELETED",
          noteId: linkedNoteId,
        },
      ],
    });
  };


  const loadNote = async (noteId) => {
    if (typeof noteId !== "number") {
      setActiveNote(getNewNoteObject());
      return;
    }

    const note = await API.getNote(noteId);
    setActiveNote({
      ...note,
      changes: [],
    });
  };


  const refreshNotesList = useCallback(
    async () => {
      setDisplayedNotes(null);

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
    if (activeNote.isUnsaved) {
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

    let noteToTransmit = {
      editorData: outputData,
    };

    if (!activeNote.isUnsaved) {
      noteToTransmit = {
        ...activeNote,
        ...noteToTransmit,
      };

      if (noteToTransmit.linkedNotes) {
        delete noteToTransmit.linkedNotes;
      }
    }

    // if the note has no title yet, take the title of the link metadata
    const firstLinkBlock = noteToTransmit.editorData.blocks.find(
      (block) => block.type === "linkTool",
    );

    if (
      (noteToTransmit.editorData.blocks[0].data.text
        === Config.DEFAULT_NOTE_TITLE)
      && firstLinkBlock
      && typeof firstLinkBlock.data.meta.title === "string"
      && firstLinkBlock.data.meta.title.length > 0
    ) {
      noteToTransmit.editorData.blocks[0].data.tex
        = firstLinkBlock.data.meta.title;
    }

    const noteFromServer = await API.putNote(noteToTransmit, options);
    setActiveNote({
      ...noteFromServer,
      isUnsaved: false,
      changes: [],
    });
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
          displayedNotes={displayedNotes}
          allNotes={allNotes}
        />
        <NotesList
          notes={displayedNotes}
          loadNote={loadNote}
          activeNote={activeNote}
          displayedLinkedNotes={displayedLinkedNotes}
          onLinkAddition={handleLinkAddition}
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
          onLinkRemoval={handleLinkRemoval}
          displayedLinkedNotes={displayedLinkedNotes}
        />
      </div>

    </main>
  </>;
};

export default App;
