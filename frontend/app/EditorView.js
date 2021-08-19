import React, {
  useEffect, useState, useCallback, useRef, useMemo,
} from "react";
import { v4 as uuidv4 } from "uuid";
import EditorViewHeader from "./EditorViewHeader.js";
import NoteList from "./NoteList.js";
import NoteListControls from "./NoteListControls.js";
import Note from "./Note.js";
import * as Utils from "./lib/utils.js";
import * as Config from "./lib/config.js";
import * as Editor from "./lib/editor.js";
import ConfirmationServiceContext from "./ConfirmationServiceContext.js";
import ImportLinksDialog from "./ImportLinksDialog.js";
import {
  useHistory,
  useParams,
} from "react-router-dom";


const EditorView = ({
  databaseProvider,
  unsavedChanges,
  setUnsavedChanges,
  toggleAppMenu,
  setOpenDialog,
  openDialog,
  setDatabaseMode,
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
  const [pinnedNotes, setPinnedNotes] = useState([]);

  const history = useHistory();
  const { activeNoteId } = useParams();
  const confirm = React.useContext(ConfirmationServiceContext);

  const displayedLinkedNotes = useMemo(() => [
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
  ], [activeNote]);


  const handleSearchInputChange = (value) => {
    setSearchValue(value);
    setNoteListScrollTop(0);
    setPage(1);
  };

  const handleLinkAddition = async (note) => {
    // return if linked note has already been added
    if (activeNote.changes.some((change) => {
      return (
        change.type === "LINKED_NOTE_ADDED"
        && change.noteId === note.id
      );
    })) {
      return;
    }

    // remove possible LINKED_NOTE_DELETED changes
    const newChanges = [
      ...activeNote.changes.filter((change) => {
        return !(
          change.type === "LINKED_NOTE_DELETED"
          && change.noteId === note.id
        );
      }),
    ];

    // if linkedNote is NOT already there and saved,
    // let's add a LINKED_NOTE_ADDED change
    if (
      !activeNote.linkedNotes.find((linkedNote) => {
        return linkedNote.id === note.id;
      })
    ) {
      newChanges.push(
        {
          type: "LINKED_NOTE_ADDED",
          noteId: note.id,
          note: {
            id: note.id,
            title: note.title,
            updateTime: note.updateTime,
          },
        },
      );
    }

    setActiveNote({
      ...activeNote,
      editorData: await Editor.save(),
      changes: newChanges,
    });

    setUnsavedChanges(true);
  };


  const duplicateNote = async () => {
    if (activeNote.isUnsaved) return;

    const noteToTransmit = {
      id: null,
      editorData: activeNote.editorData,
      changes: activeNote.linkedNotes.map((linkedNote) => {
        return {
          type: "LINKED_NOTE_ADDED",
          noteId: linkedNote.id,
        };
      }),
    };
    const noteFromServer = await databaseProvider.putNote(
      noteToTransmit, { ignoreDuplicateTitles: true },
    );
    setActiveNote({
      ...noteFromServer,
      isUnsaved: false,
      changes: [],
    });
    setUnsavedChanges(false);
    refreshNotesList();
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
      await confirm({
        text: Config.texts.discardChangesConfirmation,
        confirmText: "Discard changes",
        cancelText: "Cancel",
        encourageConfirmation: false,
      });

      setUnsavedChanges(false);
    }

    let noteIdNumber = noteId;

    if (typeof noteIdNumber !== "number") {
      noteIdNumber = parseInt(noteIdNumber);
    }

    if (isNaN(noteIdNumber)) {
      history.replace("/editor/new");
      setActiveNote(Utils.getNewNoteObject());
    } else {
      try {
        const noteFromServer = await databaseProvider.getNote(noteIdNumber);
        setActiveNote({
          ...noteFromServer,
          isUnsaved: false,
          changes: [],
        });
      } catch (e) {
        // if credentials are invalid, go to LoginView. If not, throw.
        if (e.message === "INVALID_CREDENTIALS") {
          await databaseProvider.removeAccess();
          setDatabaseMode("NONE");
          history.push("/login");
        } else {
          throw new Error(e);
        }
      }
    }
  };


  const refreshStats = () => {
    if (!databaseProvider) return;

    databaseProvider.getStats(false)
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
      if (!databaseProvider) return;

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

        const pinnedNotes = await databaseProvider.getPins();
        setPinnedNotes(pinnedNotes);
      } catch (e) {
        // if credentials are invalid, go to LoginView. If not, throw.
        if (e.message === "INVALID_CREDENTIALS") {
          await databaseProvider.removeAccess();
          setDatabaseMode("NONE");
          history.push("/login");
        } else {
          throw new Error(e);
        }
      }
    },
    [searchValue, page, sortMode, databaseProvider, activeNoteId],
  );


  const createNewNote = () => {
    history.push("/editor/new");
  };


  const removeActiveNote = async () => {
    if (activeNote.isUnsaved) {
      return;
    }

    await databaseProvider.deleteNote(activeNote.id);
    refreshNotesList();
    history.push("/editor/new");
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


  const saveActiveNote = async (options) => {
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


  const handleNoteSaveRequest = useCallback(async () => {
    try {
      await saveActiveNote({ ignoreDuplicateTitles: false });
    } catch (e) {
      if (e.message === "NOTE_WITH_SAME_TITLE_EXISTS") {
        await confirm({
          text: Config.texts.titleAlreadyExistsConfirmation,
          confirmText: "Save anyway",
          cancelText: "Cancel",
          encourageConfirmation: false,
        });

        saveActiveNote({ ignoreDuplicateTitles: true }).catch((e) => {
          alert(e);
        });
      }
    }
  });


  const handleKeydown = (e) => {
    if (
      (window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)
      && e.key === "s"
    ) {
      handleNoteSaveRequest();
      e.preventDefault();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [handleKeydown]);


  useEffect(async () => {
    loadNote(activeNoteId);
  }, [activeNoteId]);


  const pinOrUnpinNote = async () => {
    let newPinnedNotes;
    if (pinnedNotes.find((pinnedNote) => pinnedNote.id === activeNote.id)) {
      newPinnedNotes = await databaseProvider.unpinNote(activeNote.id);
    } else {
      newPinnedNotes = await databaseProvider.pinNote(activeNote.id);
    }

    setPinnedNotes(newPinnedNotes);
  };


  const importLinksAsNotes = async (links) => {
    await databaseProvider.importLinksAsNotes(links);
    setOpenDialog(null);
    refreshNotesList();
  };


  useEffect(() => {
    refreshNotesList();
  }, [searchValue, page, sortMode, databaseProvider]);


  return <>
    <EditorViewHeader
      stats={stats}
      toggleAppMenu={toggleAppMenu}
      pinnedNotes={pinnedNotes}
      note={activeNote}
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
          showNotesWithDuplicateURLs={() => handleSearchInputChange(
            "special:DUPLICATE_URLS",
          )}
        />
        <NoteList
          notes={noteListItems}
          numberOfResults={numberOfResults}
          loadNote={loadNote}
          activeNote={activeNote}
          displayedLinkedNotes={displayedLinkedNotes}
          onLinkAddition={handleLinkAddition}
          onLinkRemoval={handleLinkRemoval}
          isBusy={isBusy}
          searchValue={searchValue}
          scrollTop={noteListScrollTop}
          setScrollTop={setNoteListScrollTop}
          sortMode={sortMode}
          page={page}
          setPage={(page) => {
            setPage(page);
            setNoteListScrollTop(0);
          }}
          stats={stats}
          pinOrUnpinNote={pinOrUnpinNote}
        />
      </div>
      <div id="right-view">
        <Note
          note={activeNote}
          loadNote={loadNote}
          onLinkRemoval={handleLinkRemoval}
          displayedLinkedNotes={displayedLinkedNotes}
          setUnsavedChanges={setUnsavedChanges}
          databaseProvider={databaseProvider}
          createNewNote={createNewNote}
          handleNoteSaveRequest={handleNoteSaveRequest}
          removeActiveNote={removeActiveNote}
          unsavedChanges={unsavedChanges}
          pinOrUnpinNote={pinOrUnpinNote}
          openImportLinksDialog={() => setOpenDialog("IMPORT_LINKS")}
          duplicateNote={duplicateNote}
          openInGraphView={() => {
            history.push(`/graph?focusNote=${activeNote.id}`);
          }}
        />
      </div>
    </main>
    {
      openDialog === "IMPORT_LINKS"
        ? <ImportLinksDialog
          importLinksAsNotes={importLinksAsNotes}
          onCancel={() => setOpenDialog(null)}
        />
        : null
    }
  </>;
};

export default EditorView;
