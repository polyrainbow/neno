import React, { useEffect, useState, useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import EditorViewHeader from "./EditorViewHeader.js";
import NoteControls from "./NoteControls.js";
import NotesList from "./NotesList.js";
import NoteListControls from "./NoteListControls.js";
import Note from "./Note.js";
import * as Utils from "./lib/utils.js";
import * as Config from "./lib/config.js";
import * as Editor from "./lib/editor.js";
import ImportLinksDialog from "./ImportLinksDialog.js";

const EditorView = ({
  databaseProvider,
  setActiveView,
  unsavedChanges,
  setUnsavedChanges,
  initialNoteId,
}) => {
  const currentRequestId = useRef(null);
  const [noteListItems, setNoteListItems] = useState([]);
  const [numberOfResults, setNumberOfResults] = useState([]);
  const [noteListScrollTop, setNoteListScrollTop] = useState(0);
  const [page, setPage] = useState(1);
  const [isBusy, setIsBusy] = useState(true);
  const [stats, setStats] = useState(null);
  const [sortMode, setSortMode] = useState("CREATION_DATE_DESCENDING");
  const [activeNote, setActiveNote] = useState(Utils.getNewNoteObject());
  const [searchValue, setSearchValue] = useState("");
  const [isImportLinksDialogOpen, setIsImportLinksDialogOpen]
    = useState(false);

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
        return change.note;
      }),
  ];


  const handleSearchInputChange = (value) => {
    setSearchValue(value);
    setNoteListScrollTop(0);
    setPage(1);
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
          note: {
            id: note.id,
            title: note.title,
            updateTime: note.updateTime,
          },
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
      const confirmed = confirm(Config.texts.discardChangesConfirmation);

      if (!confirmed) {
        return;
      }

      setUnsavedChanges(false);
    }

    if (typeof noteId !== "number" || isNaN(noteId)) {
      setActiveNote(Utils.getNewNoteObject());
      return;
    }

    const noteFromServer = await databaseProvider.getNote(noteId);
    setActiveNote({
      ...noteFromServer,
      isUnsaved: false,
      changes: [],
    });
  };


  const refreshStats = () => {
    databaseProvider.getStats()
      .then((stats) => {
        setStats(stats);
      })
      .catch((e) => {
        // if credentials are invalid, it's fine, refeshNotesList takes care of
        // this. if there is another error, throw.
        if (e.message !== "INVALID_CREDENTIALS") {
          throw new Error(e);
        }
      });
  };


  const refreshNotesList = useCallback(
    async () => {
      refreshStats();
      setNoteListItems([]);

      // if searchValue is given but below MINIMUM_SEARCH_QUERY_LENGTH,
      // we don't do anything and leave the note list empty
      if (
        searchValue.length > 0
        && searchValue.length < Config.MINIMUM_SEARCH_QUERY_LENGTH
      ) {
        return;
      }

      setIsBusy(true);

      const options = {
        page,
        sortMode,
      };

      if (searchValue.length >= Config.MINIMUM_SEARCH_QUERY_LENGTH) {
        options.query = searchValue;
        options.caseSensitive = false;
      }

      const requestId = uuidv4();
      currentRequestId.current = requestId;
      try {
        const {
          results,
          numberOfResults,
        } = await databaseProvider.getNotes(options);

        // ... some time later - check if this is the current request
        if (currentRequestId.current === requestId) {
          setNoteListItems(results);
          setNumberOfResults(numberOfResults);
          setIsBusy(false);
        }
      } catch (e) {
        // if credentials are invalid, go to LoginView. If not, throw.
        if (e.message === "INVALID_CREDENTIALS") {
          setActiveView("LOGIN");
        } else {
          throw new Error(e);
        }
      }
    },
    [searchValue, page, sortMode],
  );


  const createNewNote = () => {
    loadNote(null);
    refreshNotesList();
  };


  const removeActiveNote = async () => {
    if (activeNote.isUnsaved) {
      return;
    }

    await databaseProvider.deleteNote(activeNote.id);
    loadNote(null);
    refreshNotesList();
  };


  const prepareNoteToTransmit = async () => {
    const noteToTransmit = {
      editorData: await Editor.save(),
      changes: activeNote.changes,
      id: activeNote.isUnsaved ? null : activeNote.id,
    };

    Utils.setNoteTitleByLinkTitleIfUnset(
      noteToTransmit,
      Config.DEFAULT_NOTE_TITLE,
    );

    return noteToTransmit;
  };


  const saveNote = async (options) => {
    const noteToTransmit = await prepareNoteToTransmit();
    const noteFromServer = await databaseProvider.putNote(
      noteToTransmit, options,
    );
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
    if (typeof initialNoteId === "number") {
      loadNote(initialNoteId);
      return;
    }

    const initialId = parseInt(
      Utils.getParameterByName("id", window.location.href),
    );
    if (typeof initialId === "number" && !isNaN(initialId)) {
      loadNote(initialId);
      return;
    }

    loadNote(null);
  }, []);


  useEffect(() => {
    refreshNotesList();
  }, [searchValue, page, sortMode]);


  const importLinksAsNotes = async (links) => {
    await databaseProvider.importLinksAsNotes(links);
    setIsImportLinksDialogOpen(false);
    refreshNotesList();
  };


  return <>
    {
      isImportLinksDialogOpen
        ? <ImportLinksDialog
          importLinksAsNotes={importLinksAsNotes}
          onCancel={() => setIsImportLinksDialogOpen(false)}
        />
        : null
    }
    <EditorViewHeader
      databaseProvider={databaseProvider}
      stats={stats}
      openImportLinksDialog={() => setIsImportLinksDialogOpen(true)}
      setActiveView={setActiveView}
    />
    <main>
      <div id="left-view">
        <NoteListControls
          onChange={handleSearchInputChange}
          value={searchValue}
          displayedNotes={noteListItems}
          stats={stats}
          sortMode={sortMode}
          setSortMode={(sortMode) => {
            setNoteListScrollTop(0);
            setSortMode(sortMode);
            setPage(1);
          }}
        />
        <NotesList
          notes={noteListItems}
          numberOfResults={numberOfResults}
          loadNote={loadNote}
          activeNote={activeNote}
          displayedLinkedNotes={displayedLinkedNotes}
          onLinkAddition={handleLinkAddition}
          isBusy={isBusy}
          searchValue={searchValue}
          scrollTop={noteListScrollTop}
          setScrollTop={setNoteListScrollTop}
          sortMode={sortMode}
          page={page}
          setPage={setPage}
          stats={stats}
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
          databaseProvider={databaseProvider}
        />
      </div>

    </main>
  </>;
};

export default EditorView;
