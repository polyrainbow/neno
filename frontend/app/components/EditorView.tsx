import React, {
  useEffect, useState, useMemo,
} from "react";
import EditorViewHeader from "./EditorViewHeader";
import NoteList from "./NoteList";
import NoteListControls from "./NoteListControls";
import Note from "./Note";
import * as Utils from "../lib/utils";
import * as Config from "../lib/config";
import * as Editor from "../lib/editor";
import ConfirmationServiceContext from "../contexts/ConfirmationServiceContext";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import {
  UserNoteChangeType,
} from "../../../lib/notes/interfaces/UserNoteChangeType";
import ActiveNote from "../interfaces/ActiveNote";
import FrontendUserNoteChange from "../interfaces/FrontendUserNoteChange";
import { DialogType } from "../enum/DialogType";
import useConfirmDiscardingUnsavedChangesDialog
  from "../hooks/useConfirmDiscardingUnsavedChangesDialog";
import useGoToNote from "../hooks/useGoToNote";
import NoteFromUser from "../../../lib/notes/interfaces/NoteFromUser";
import { PathTemplate } from "../enum/PathTemplate";
import useDialog from "../hooks/useDialog";
import { l } from "../lib/intl";

const EditorView = ({
  databaseProvider,
  unsavedChanges,
  setUnsavedChanges,
  toggleAppMenu,
  handleInvalidCredentialsError,
  refreshNotesList,
  stats,
  pinnedNotes,
  handleSearchInputChange,
  setPinnedNotes,
  searchValue,
  sortMode,
  handleSortModeChange,
  noteListItems,
  numberOfResults,
  noteListIsBusy,
  noteListScrollTop,
  setNoteListScrollTop,
  page,
  setPage,
  setSearchValue,
}) => {
  const newNoteObject:ActiveNote = Utils.getNewNoteObject();
  const [activeNote, setActiveNote] = useState<ActiveNote>(newNoteObject);

  const isSmallScreen = useIsSmallScreen();

  const navigate = useNavigate();
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

    if (unsavedChanges) {
      await confirmDiscardingUnsavedChanges();
      setUnsavedChanges(false);
    }

    const noteToTransmit:NoteFromUser = {
      title: activeNote.title,
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
    let noteIdNumber = noteId;

    if (typeof noteIdNumber !== "number") {
      noteIdNumber = parseInt(noteIdNumber);
    }

    /* if we don't have a note id, let's create a new note */
    if (isNaN(noteIdNumber)) {
      /* optionally attach existing file to new note */
      const searchParams = new URLSearchParams(location.search);
      const fileIdToAttach = searchParams.get("attach-file");
      const newNoteObject = Utils.getNewNoteObject(
        fileIdToAttach ? [fileIdToAttach] : undefined,
      );
      setActiveNote(newNoteObject);

      /* whatever has been written to the address bar, let's replace it with
      the canonical path for a new note */
      navigate(
        Utils.getAppPath(PathTemplate.EDITOR_WITH_NEW_NOTE),
        { replace: true },
      );
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


  const createNewNote = () => {
    navigate(Utils.getAppPath(PathTemplate.EDITOR_WITH_NEW_NOTE));
  };


  const removeActiveNote = async () => {
    if (activeNote.isUnsaved) {
      return;
    }

    await databaseProvider.deleteNote(activeNote.id);
    refreshNotesList();
    navigate(Utils.getAppPath(PathTemplate.EDITOR_WITH_NEW_NOTE));
  };


  const prepareNoteToTransmit = async ():Promise<NoteFromUser> => {
    const noteToTransmit:NoteFromUser = {
      title: activeNote.title,
      blocks: await Editor.save(),
      changes: activeNote.changes,
      // eslint-disable-next-line no-undefined
      id: (!activeNote.isUnsaved) ? activeNote.id : undefined,
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
    /*
      when saving the new note for the first time, we get its id from the
      databaseProvider. then we update the address bar to include the new id
    */
    goToNote(noteFromServer.id, true);
  };


  const handleNoteSaveRequest = async () => {
    try {
      await saveActiveNote({ ignoreDuplicateTitles: false });
    } catch (e) {
      if (e.message === "NOTE_WITH_SAME_TITLE_EXISTS") {
        await confirm({
          text: Config.texts.titleAlreadyExistsConfirmation,
          confirmText: l("editor.save-anyway"),
          cancelText: l("editor.cancel"),
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
      // navigator.platform is deprecated and should be replaced with
      // navigator.userAgentData.platform at some point
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
    document.title = activeNote.title.length > 0
      ? activeNote.title
      : Config.DEFAULT_DOCUMENT_TITLE;

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


  const openSearchDialog = useDialog(DialogType.SEARCH, setSearchValue);


  return <>
    <EditorViewHeader
      stats={stats}
      toggleAppMenu={toggleAppMenu}
      pinnedNotes={pinnedNotes}
      activeNote={activeNote}
      setUnsavedChanges={setUnsavedChanges}
      unsavedChanges={unsavedChanges}
    />
    <main>
      {
        !isSmallScreen
          ? <div id="left-view">
            <NoteListControls
              onChange={handleSearchInputChange}
              value={searchValue}
              sortMode={sortMode}
              setSortMode={handleSortModeChange}
              openSearchDialog={openSearchDialog}
              refreshNoteList={refreshNotesList}
            />
            <NoteList
              notes={noteListItems}
              numberOfResults={numberOfResults}
              activeNote={activeNote}
              displayedLinkedNotes={displayedLinkedNotes}
              onLinkAddition={handleLinkAddition}
              onLinkRemoval={handleLinkRemoval}
              isBusy={noteListIsBusy}
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
              setUnsavedChanges={setUnsavedChanges}
              unsavedChanges={unsavedChanges}
            />
          </div>
          : null
      }
      <div id="right-view">
        <Note
          note={activeNote}
          setNoteTitle={
            (newTitle) => {
              setActiveNote({
                ...activeNote,
                title: newTitle,
              });
            }
          }
          onLinkAddition={handleLinkAddition}
          onLinkRemoval={handleLinkRemoval}
          displayedLinkedNotes={displayedLinkedNotes}
          setUnsavedChanges={setUnsavedChanges}
          databaseProvider={databaseProvider}
          createNewNote={createNewNote}
          handleNoteSaveRequest={handleNoteSaveRequest}
          removeActiveNote={removeActiveNote}
          unsavedChanges={unsavedChanges}
          pinOrUnpinNote={pinOrUnpinNote}
          duplicateNote={duplicateNote}
          openInGraphView={() => {
            navigate(
              Utils.getAppPath(
                PathTemplate.GRAPH_WITH_FOCUS_NOTE,
                new Map([["FOCUS_NOTE_ID", activeNote.id.toString()]]),
              ),
            );
          }}
        />
      </div>
    </main>
  </>;
};

export default EditorView;
