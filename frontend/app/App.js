import React, { useEffect, useState, useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import Header from "./Header.js";
import NoteControls from "./NoteControls.js";
import NotesList from "./NotesList.js";
import NoteListControls from "./NoteListControls.js";
import Note from "./Note.js";
import * as Utils from "./lib/utils.js";
import * as Config from "./lib/config.js";
import * as API from "./lib/api.js";
import * as Editor from "./lib/editor.js";
import ImportLinksDialog from "./ImportLinksDialog.js";

const App = () => {
  const currentRequestId = useRef(null);
  const [displayedNotes, setDisplayedNotes] = useState([]);
  const [noteListScrollTop, setNoteListScrollTop] = useState(0);
  const [allNotes, setAllNotes] = useState(null);
  const [isBusy, setIsBusy] = useState(true);
  const [links, setLinks] = useState(null);
  const [sortBy, setSortBy] = useState("CREATION_DATE_ASCENDING");
  const [activeNote, setActiveNote] = useState(Utils.getNewNoteObject());
  const [searchValue, setSearchValue] = useState("");
  const [isImportLinksDialogOpen, setIsImportLinksDialogOpen]
    = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

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

  const displayedNotesSorted = displayedNotes.sort(
    Utils.getSortFunction(sortBy),
  );

  const handleSearchInputChange = (value) => {
    setSearchValue(value);
    setNoteListScrollTop(0);
  };

  const handleLinkAddition = async (note) => {
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
      editorData: await Editor.save(),
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

    setUnsavedChanges(true);
  };


  const handleLinkRemoval = async (linkedNoteId) => {
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
      editorData: await Editor.save(),
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

    setUnsavedChanges(true);
  };


  const loadNote = async (noteId) => {
    if (unsavedChanges) {
      const confirmed = confirm(
        "There are unsaved changes. Do you really want to discard them "
        + "and load another note?",
      );

      if (!confirmed) {
        return;
      }

      setUnsavedChanges(false);
    }

    if (typeof noteId !== "number") {
      setActiveNote(Utils.getNewNoteObject());
      return;
    }

    const noteFromServer = await API.getNote(noteId);
    setActiveNote({
      ...noteFromServer,
      isUnsaved: false,
      changes: [],
    });
  };

  const refreshNotesList = useCallback(
    async () => {
      setDisplayedNotes([]);

      // if searchValue is given but below MINIMUM_SEARCH_QUERY_LENGTH,
      // we don't do anything and leave the note list empty
      if (
        searchValue.length > 0
        && searchValue.length < Config.MINIMUM_SEARCH_QUERY_LENGTH
      ) {
        return;
      }

      setIsBusy(true);

      const options = {};

      if (searchValue.length >= Config.MINIMUM_SEARCH_QUERY_LENGTH) {
        options.query = searchValue;
        options.caseSensitive = false;
      }

      const requestId = uuidv4();
      currentRequestId.current = requestId;
      const notes = await API.getNotes(options);

      // ... some time later - check if this is the current request
      if (currentRequestId.current === requestId) {
        setDisplayedNotes(notes);
        if (searchValue.length === 0) {
          setAllNotes(notes);
        }

        setIsBusy(false);
      }
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
    const noteToTransmit = {
      editorData: await Editor.save(),
      changes: activeNote.changes,
      id: activeNote.isUnsaved ? null : activeNote.id,
    };

    // if the note has no title yet, take the title of the link metadata
    const firstLinkBlock = noteToTransmit.editorData.blocks.find(
      (block) => block.type === "linkTool",
    );

    if (
      (noteToTransmit.editorData?.blocks?.[0]?.data?.text
        === Config.DEFAULT_NOTE_TITLE)
      && firstLinkBlock
      && typeof firstLinkBlock.data.meta.title === "string"
      && firstLinkBlock.data.meta.title.length > 0
    ) {
      noteToTransmit.editorData.blocks[0].data.text
        = firstLinkBlock.data.meta.title;
    }

    const noteFromServer = await API.putNote(noteToTransmit, options);
    setActiveNote({
      ...noteFromServer,
      isUnsaved: false,
      changes: [],
    });
    setUnsavedChanges(false);
    refreshNotesList();
  };


  // startup
  useEffect(() => {
    const initialId = parseInt(
      Utils.getParameterByName("id", window.location.href),
    );
    if (initialId) {
      loadNote(initialId);
    }
  }, []);


  useEffect(() => {
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

  const importLinksAsNotes = async (links) => {
    await API.importLinksAsNotes(links);
    refreshNotesList();
  };


  return <>
    {
      isImportLinksDialogOpen
        ? <ImportLinksDialog
          importLinksAsNotes={(links) => {
            importLinksAsNotes(links);
            setIsImportLinksDialogOpen(false);
          }}
          onCancel={() => setIsImportLinksDialogOpen(false)}
        />
        : null
    }
    <Header
      allNotes={allNotes}
      links={links}
      openImportLinksDialog={() => setIsImportLinksDialogOpen(true)}
    />
    <main>
      <div id="left-view">
        <NoteListControls
          onChange={handleSearchInputChange}
          value={searchValue}
          displayedNotes={displayedNotesSorted}
          allNotes={allNotes}
          sortBy={sortBy}
          setSortBy={(sortBy) => {
            setNoteListScrollTop(0);
            setSortBy(sortBy);
          }}
        />
        <NotesList
          notes={displayedNotes}
          loadNote={loadNote}
          activeNote={activeNote}
          displayedLinkedNotes={displayedLinkedNotes}
          onLinkAddition={handleLinkAddition}
          isBusy={isBusy}
          searchValue={searchValue}
          scrollTop={noteListScrollTop}
          setScrollTop={setNoteListScrollTop}
          sortBy={sortBy}
        />
      </div>
      <div id="right-view">
        <NoteControls
          activeNote={activeNote}
          createNewNote={createNewNote}
          saveNote={saveNote}
          removeActiveNote={removeActiveNote}
          unsavedChanges={unsavedChanges}
        />
        <Note
          note={activeNote}
          loadNote={loadNote}
          onLinkRemoval={handleLinkRemoval}
          displayedLinkedNotes={displayedLinkedNotes}
          setUnsavedChanges={setUnsavedChanges}
        />
      </div>

    </main>
  </>;
};

export default App;
