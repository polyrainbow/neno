import React, {
  useEffect, useState,
} from "react";
import EditorViewHeader from "./EditorViewHeader";
import NoteList from "./NoteList";
import NoteListControls from "./NoteListControls";
import Note from "./Note";
import * as Utils from "../lib/utils";
import * as Config from "../config";
import * as Editor from "../lib/editor";
import ConfirmationServiceContext from "../contexts/ConfirmationServiceContext";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import {
  UserNoteChangeType,
} from "../../../lib/notes/interfaces/UserNoteChangeType";
import ActiveNote, { UnsavedActiveNote } from "../interfaces/ActiveNote";
import FrontendUserNoteChange from "../interfaces/FrontendUserNoteChange";
import { DialogType } from "../enum/DialogType";
import useConfirmDiscardingUnsavedChangesDialog
  from "../hooks/useConfirmDiscardingUnsavedChangesDialog";
import useGoToNote from "../hooks/useGoToNote";
import NoteFromUser from "../../../lib/notes/interfaces/NoteFromUser";
import { PathTemplate } from "../enum/PathTemplate";
import useDialog from "../hooks/useDialog";
import { l } from "../lib/intl";
import DatabaseProvider from "../interfaces/DatabaseProvider";
import { NoteListSortMode }
  from "../../../lib/notes/interfaces/NoteListSortMode";
import { ErrorMessage } from "../../../lib/notes/interfaces/ErrorMessage";
import { NoteId } from "../../../lib/notes/interfaces/NoteId";
import NoteToTransmit from "../../../lib/notes/interfaces/NoteToTransmit";
import NotePutOptions from "../../../lib/notes/interfaces/NotePutOptions";
import UserNoteChange from "../../../lib/notes/interfaces/UserNoteChange";
import { MainNoteListItem } from "../interfaces/NoteListItem";
import GraphStats from "../../../lib/notes/interfaces/GraphStats";
import useKeyboardShortcuts from "../hooks/useKeyboardShortcuts";
import useDisplayedLinkedNotes from "../hooks/useDisplayedLinkedNotes";


interface EditorViewProps {
  databaseProvider: DatabaseProvider,
  unsavedChanges: boolean,
  setUnsavedChanges: (boolean) => any,
  toggleAppMenu: () => any,
  handleInvalidCredentialsError,
  refreshNotesList,
  headerStats: GraphStats | null,
  pinnedNotes: NoteToTransmit[],
  handleSearchInputChange,
  setPinnedNotes,
  searchValue,
  sortMode: NoteListSortMode,
  handleSortModeChange,
  noteListItems,
  numberOfResults,
  noteListIsBusy,
  noteListScrollTop,
  setNoteListScrollTop,
  page: number,
  setPage: (number) => any,
  setSearchValue,
}

const EditorView = ({
  databaseProvider,
  unsavedChanges,
  setUnsavedChanges,
  toggleAppMenu,
  handleInvalidCredentialsError,
  refreshNotesList,
  headerStats,
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
}:EditorViewProps) => {
  const newNoteObject:UnsavedActiveNote = Utils.getNewNoteObject();
  const [activeNote, setActiveNote] = useState<ActiveNote>(newNoteObject);

  const isSmallScreen = useIsSmallScreen();

  const navigate = useNavigate();
  const location = useLocation();
  const goToNote = useGoToNote();
  const params = useParams();
  const activeNoteId:NoteId
    = (
      typeof params.activeNoteId === "string"
      && Utils.stringContainsOnlyDigits(params.activeNoteId)
    )
      ? parseInt(params.activeNoteId)
      : NaN;

  const confirm = React.useContext(ConfirmationServiceContext) as (any) => void;
  const confirmDiscardingUnsavedChanges
    = useConfirmDiscardingUnsavedChangesDialog();

  const displayedLinkedNotes = useDisplayedLinkedNotes(activeNote);

  const handleLinkAddition = async (note:MainNoteListItem):Promise<void> => {
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
      activeNote.isUnsaved
      || (!activeNote.linkedNotes.find((linkedNote) => {
        return linkedNote.id === note.id;
      }))
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
      blocks: await Editor.save(),
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


  const handleLinkRemoval = async (linkedNoteId:NoteId) => {
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


  const loadNote = async (noteId:NoteId) => {
    /* if we don't have a note id, let's create a new note */
    if (isNaN(noteId)) {
      /* whatever has been written to the address bar, let's replace it with
      the canonical path for a new note */
      navigate(
        Utils.getAppPath(
          PathTemplate.EDITOR_WITH_NEW_NOTE,
          undefined,
          new URLSearchParams(location.search),
        ),
        { replace: true },
      );

      /* optionally attach existing file to new note */
      const searchParams = new URLSearchParams(location.search);
      const fileIdToAttach = searchParams.get("attach-file");
      const newNoteObject:UnsavedActiveNote = Utils.getNewNoteObject();
      setActiveNote(newNoteObject);
      const newBlocks = Utils.getNewNoteBlocks(
        fileIdToAttach ? [fileIdToAttach] : undefined,
      );
      await Editor.scheduleUpdate(newBlocks);
    } else {
      try {
        const noteFromServer = await databaseProvider.getNote(noteId);
        if (noteFromServer) {
          setActiveNote({
            ...noteFromServer,
            isUnsaved: false,
            changes: [],
            blocks: noteFromServer.blocks,
          });
          await Editor.scheduleUpdate(noteFromServer.blocks);
        } else {
          throw new Error("No note received");
        }
      } catch (e) {
        // if credentials are invalid, go to LoginView. If not, throw.
        if (e instanceof Error && e.message === "INVALID_CREDENTIALS") {
          await handleInvalidCredentialsError();
        } else {
          throw e;
        }
      }
    }
  };


  const createNewNote = async () => {
    if (unsavedChanges) {
      await confirmDiscardingUnsavedChanges();
      setUnsavedChanges(false);
    }

    // if the active note is already NaN, we need to manually reload the note
    // because navigating to it again won't change the state at all
    if (isNaN(activeNoteId)) {
      await loadNote(NaN);
    } else {
      navigate(Utils.getAppPath(PathTemplate.EDITOR_WITH_NEW_NOTE));
    }
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
      changes: activeNote.changes.map(
        (change:FrontendUserNoteChange):UserNoteChange => {
          return {
            type: change.type,
            noteId: change.noteId,
          };
        }),
      // eslint-disable-next-line no-undefined
      id: (!activeNote.isUnsaved) ? activeNote.id : undefined,
    };

    Utils.setNoteTitleByLinkTitleIfUnset(
      noteToTransmit,
      Config.DEFAULT_NOTE_TITLE,
    );

    return noteToTransmit;
  };


  const saveActiveNote = async (options:NotePutOptions):Promise<void> => {
    const noteToTransmit = await prepareNoteToTransmit();
    const noteFromDatabase = await databaseProvider.putNote(
      noteToTransmit, options,
    );
    setActiveNote({
      isUnsaved: false,
      id: noteFromDatabase.id,
      title: noteFromDatabase.title,
      creationTime: noteFromDatabase.creationTime,
      updateTime: noteFromDatabase.updateTime,
      linkedNotes: noteFromDatabase.linkedNotes,
      position: noteFromDatabase.position,
      numberOfCharacters: noteFromDatabase.numberOfCharacters,
      blocks: noteFromDatabase.blocks,
      changes: [],
    });
    setUnsavedChanges(false);
    refreshNotesList();
    /*
      when saving the new note for the first time, we get its id from the
      databaseProvider. then we update the address bar to include the new id
    */
    goToNote(noteFromDatabase.id, true);
  };


  const handleNoteSaveRequest = async ():Promise<void> => {
    try {
      await saveActiveNote({ ignoreDuplicateTitles: false });
    } catch (e) {
      if (
        e instanceof Error
        && e.message === ErrorMessage.NOTE_WITH_SAME_TITLE_EXISTS
      ) {
        await confirm({
          text: l("editor.title-already-exists-confirmation"),
          confirmText: l("editor.save-anyway"),
          cancelText: l("editor.cancel"),
          encourageConfirmation: false,
        });

        saveActiveNote({ ignoreDuplicateTitles: true }).catch((e) => {
          alert(e);
        });
      } else {
        alert(e);
      }
    }
  };


  useKeyboardShortcuts({
    onSave: handleNoteSaveRequest,
  });


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


  const pinOrUnpinNote = async (noteId:NoteId) => {
    let newPinnedNotes:NoteToTransmit[];
    if (pinnedNotes.find((pinnedNote) => pinnedNote.id === noteId)) {
      newPinnedNotes = await databaseProvider.unpinNote(noteId);
    } else {
      newPinnedNotes = await databaseProvider.pinNote(noteId);
    }

    setPinnedNotes(newPinnedNotes);
  };


  const openSearchDialog = useDialog(DialogType.SEARCH, setSearchValue);


  return <>
    <EditorViewHeader
      stats={headerStats}
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
              stats={headerStats}
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
            (newTitle:string):void => {
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
            if (activeNote.isUnsaved) {
              throw new Error("Cannot open an unsaved note in graph view");
            }

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
