import React, {
  useEffect, useState, useCallback, useRef, useMemo,
} from "react";
import EditorViewHeader from "./EditorViewHeader";
import NoteList from "./NoteList";
import NoteListControls from "./NoteListControls";
import Note from "./Note";
import * as Utils from "./lib/utils";
import * as Config from "./lib/config";
import * as Editor from "./lib/editor";
import ConfirmationServiceContext from "./ConfirmationServiceContext";
import ImportLinksDialog from "./ImportLinksDialog";
import {
  useHistory,
  useParams,
} from "react-router-dom";
import useIsSmallScreen from "./hooks/useIsSmallScreen";
import {
  UserNoteChangeType,
} from "../../lib/notes/interfaces/UserNoteChangeType";
import ActiveNote from "./interfaces/ActiveNote";
import FrontendUserNoteChange from "./interfaces/FrontendUserNoteChange";
import { Dialog } from "./enum/Dialog";
import useConfirmDiscardingUnsavedChangesDialog
  from "./hooks/useConfirmDiscardingUnsavedChangesDialog";
import useGoToNote from "./hooks/useGoToNote";
import NoteListItemType from "../../lib/notes/interfaces/NoteListItem";

const EditorView = ({
  databaseProvider,
  unsavedChanges,
  setUnsavedChanges,
  toggleAppMenu,
  setOpenDialog,
  openDialog,
  handleInvalidCredentialsError,
}) => {
  const newNoteObject:ActiveNote = Utils.getNewNoteObject();
  const currentRequestId = useRef<string>("");
  const [noteListItems, setNoteListItems] = useState<NoteListItemType[]>([]);
  const [numberOfResults, setNumberOfResults] = useState<number>(NaN);
  const [noteListScrollTop, setNoteListScrollTop] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [isBusy, setIsBusy] = useState<boolean>(true);
  const [stats, setStats] = useState(null);
  const [sortMode, setSortMode] = useState("CREATION_DATE_DESCENDING");
  const [activeNote, setActiveNote] = useState<ActiveNote>(newNoteObject);
  const [searchValue, setSearchValue] = useState<string>("");
  const [pinnedNotes, setPinnedNotes] = useState<any[]>([]);

  const isSmallScreen = useIsSmallScreen();

  const history = useHistory();
  const goToNote = useGoToNote();
  const { activeNoteId } = useParams();
  const confirm = React.useContext(ConfirmationServiceContext) as (any) => void;
  const confirmDiscardingUnsavedChanges
    = useConfirmDiscardingUnsavedChangesDialog();

  const displayedLinkedNotes = useMemo(() => [
    ...(!activeNote.isUnsaved)
      ? activeNote.linkedNotes.filter((note) => {
        const isRemoved = activeNote.changes.some((change) => {
          return (
            change.type === UserNoteChangeType.LINKED_NOTE_DELETED
            && change.noteId === note.id
          );
        });
        return !isRemoved;
      })
      : [],
    ...activeNote.changes
      .filter((change) => {
        return change.type === UserNoteChangeType.LINKED_NOTE_ADDED;
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
        change.type === UserNoteChangeType.LINKED_NOTE_ADDED
        && change.noteId === note.id
      );
    })) {
      return;
    }

    // remove possible LINKED_NOTE_DELETED changes
    const newChanges = [
      ...activeNote.changes.filter((change) => {
        return !(
          change.type === UserNoteChangeType.LINKED_NOTE_DELETED
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
          type: UserNoteChangeType.LINKED_NOTE_ADDED,
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
      blocks: await Editor.save(),
      changes: newChanges,
    });

    setUnsavedChanges(true);
  };


  const duplicateNote = async () => {
    if (activeNote.isUnsaved) return;

    const noteToTransmit = {
      id: null,
      blocks: activeNote.blocks,
      changes: activeNote.linkedNotes.map((linkedNote) => {
        return {
          type: UserNoteChangeType.LINKED_NOTE_ADDED,
          noteId: linkedNote.id,
        };
      }),
    };
    const noteFromServer = await databaseProvider.putNote(
      noteToTransmit, { ignoreDuplicateTitles: true },
    );
    setUnsavedChanges(false);
    refreshNotesList();
    goToNote(noteFromServer.id);
  };


  const handleLinkRemoval = async (linkedNoteId) => {
    if (activeNote.changes.some((change) => {
      return (
        change.type === UserNoteChangeType.LINKED_NOTE_DELETED
        && change.noteId === linkedNoteId
      );
    })) {
      return;
    }

    setActiveNote({
      ...activeNote,
      blocks: await Editor.save(),
      changes: [
        ...activeNote.changes.filter(
          (change:FrontendUserNoteChange):boolean => {
            return !(
              change.type === UserNoteChangeType.LINKED_NOTE_ADDED
              && change.noteId === linkedNoteId
            );
          },
        ),
        {
          type: UserNoteChangeType.LINKED_NOTE_DELETED,
          noteId: linkedNoteId,
        },
      ],
    });

    setUnsavedChanges(true);
  };


  const loadNote = async (noteId) => {
    if (unsavedChanges) {
      await confirmDiscardingUnsavedChanges();
      setUnsavedChanges(false);
    }

    let noteIdNumber = noteId;

    if (typeof noteIdNumber !== "number") {
      noteIdNumber = parseInt(noteIdNumber);
    }

    if (isNaN(noteIdNumber)) {
      history.replace(Config.paths.newNote);
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
          await handleInvalidCredentialsError();
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
        query: "",
        caseSensitive: false,
      };

      if (searchValue.length >= Config.MINIMUM_SEARCH_QUERY_LENGTH) {
        options.query = searchValue;
      }

      //@ts-ignore randomUUID not yet in types
      const requestId = crypto.randomUUID();
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
          await handleInvalidCredentialsError();
        } else {
          throw new Error(e);
        }
      }
    },
    [searchValue, page, sortMode, databaseProvider, activeNoteId],
  );


  const createNewNote = () => {
    history.push(Config.paths.newNote);
  };


  const removeActiveNote = async () => {
    if (activeNote.isUnsaved) {
      return;
    }

    await databaseProvider.deleteNote(activeNote.id);
    refreshNotesList();
    history.push(Config.paths.newNote);
  };


  const prepareNoteToTransmit = async () => {
    const noteToTransmit = {
      blocks: await Editor.save(),
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
    goToNote(noteFromServer.id, true);
  };


  const handleNoteSaveRequest = async () => {
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
  };


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


  useEffect(() => {
    loadNote(activeNoteId);
  }, [activeNoteId]);

  useEffect(() => {
    document.title = activeNote.title;

    return () => {
      document.title = Config.DEFAULT_DOCUMENT_TITLE;
    };
  }, [activeNote]);


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
      activeNote={activeNote}
    />
    <main>
      {
        !isSmallScreen
          ? <div id="left-view">
            <NoteListControls
              onChange={handleSearchInputChange}
              value={searchValue}
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
              itemsAreLinkable={true}
            />
          </div>
          : null
      }
      <div id="right-view">
        <Note
          note={activeNote}
          onLinkRemoval={handleLinkRemoval}
          displayedLinkedNotes={displayedLinkedNotes}
          setUnsavedChanges={setUnsavedChanges}
          databaseProvider={databaseProvider}
          createNewNote={createNewNote}
          handleNoteSaveRequest={handleNoteSaveRequest}
          removeActiveNote={removeActiveNote}
          unsavedChanges={unsavedChanges}
          pinOrUnpinNote={pinOrUnpinNote}
          openImportLinksDialog={() => setOpenDialog(Dialog.IMPORT_LINKS)}
          duplicateNote={duplicateNote}
          openInGraphView={() => {
            history.push(
              Config.paths.graphWithFocusNote.replace(
                "%FOCUS_NOTE_ID%",
                activeNote.id.toString(),
              ),
            );
          }}
        />
      </div>
    </main>
    {
      openDialog === Dialog.IMPORT_LINKS
        ? <ImportLinksDialog
          importLinksAsNotes={importLinksAsNotes}
          onCancel={() => setOpenDialog(null)}
        />
        : null
    }
  </>;
};

export default EditorView;
