import React, {
  useEffect, useContext,
} from "react";
import NoteViewHeader from "./NoteViewHeader";
import NoteList from "./NoteList";
import NoteListControls from "./NoteListControls";
import Note from "./Note";
import * as Utils from "../lib/utils";
import * as Config from "../config";
import {
  useNavigate,
} from "react-router-dom";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import {
  UserNoteChangeType,
} from "../../../lib/notes/interfaces/UserNoteChangeType";
import FrontendUserNoteChange from "../interfaces/FrontendUserNoteChange";
import { DialogType } from "../enum/DialogType";
import { PathTemplate } from "../enum/PathTemplate";
import useDialog from "../hooks/useDialog";
import DatabaseProvider from "../interfaces/DatabaseProvider";
import { NoteListSortMode }
  from "../../../lib/notes/interfaces/NoteListSortMode";
import { NoteId } from "../../../lib/notes/interfaces/NoteId";
import NoteToTransmit from "../../../lib/notes/interfaces/NoteToTransmit";
import { MainNoteListItem } from "../interfaces/NoteListItem";
import GraphStats from "../../../lib/notes/interfaces/GraphStats";
import useKeyboardShortcuts from "../hooks/useKeyboardShortcuts";
import useDisplayedLinkedNotes from "../hooks/useDisplayedLinkedNotes";
import { FileInfo } from "../../../lib/notes/interfaces/FileInfo";
import { ErrorMessage } from "../../../lib/notes/interfaces/ErrorMessage";
import ConfirmationServiceContext from "../contexts/ConfirmationServiceContext";
import { l } from "../lib/intl";


interface NoteViewProps {
  databaseProvider: DatabaseProvider,
  unsavedChanges: boolean,
  setUnsavedChanges: (boolean) => any,
  toggleAppMenu: () => any,
  refreshContentViews: () => void,
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
  activeNote,
  setActiveNote,
  createNewNote,
  createNewLinkedNote,
  removeActiveNote,
  duplicateNote,
  saveActiveNote,
  contentMode,
  setNoteContent,
  toggleEditMode,
}

const NoteView = ({
  databaseProvider,
  activeNote,
  setActiveNote,
  unsavedChanges,
  setUnsavedChanges,
  toggleAppMenu,
  refreshContentViews,
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
  createNewNote,
  createNewLinkedNote,
  removeActiveNote,
  duplicateNote,
  saveActiveNote,
  contentMode,
  setNoteContent,
  toggleEditMode,
}: NoteViewProps) => {
  const isSmallScreen = useIsSmallScreen();
  const navigate = useNavigate();
  const confirm = useContext(ConfirmationServiceContext) as (any) => void;
  const displayedLinkedNotes = useDisplayedLinkedNotes(activeNote);

  const handleLinkAddition = async (note: MainNoteListItem): Promise<void> => {
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
            updatedAt: note.updatedAt,
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


  const handleLinkRemoval = async (linkedNoteId: NoteId) => {
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
          (change: FrontendUserNoteChange): boolean => {
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


  const handleNoteSaveRequest = async (): Promise<void> => {
    try {
      await saveActiveNote(false);
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

        saveActiveNote(true).catch((e) => {
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
    document.title = activeNote.title.length > 0
      ? activeNote.title
      : activeNote.isUnsaved
        ? l("editor.new-note")
        : l("list.untitled-note");

    return () => {
      document.title = Config.DEFAULT_DOCUMENT_TITLE;
    };
  }, [activeNote]);


  const pinOrUnpinNote = async (noteId: NoteId) => {
    let newPinnedNotes: NoteToTransmit[];
    if (pinnedNotes.find((pinnedNote) => pinnedNote.meta.id === noteId)) {
      newPinnedNotes = await databaseProvider.unpinNote(noteId);
    } else {
      newPinnedNotes = await databaseProvider.pinNote(noteId);
    }

    setPinnedNotes(newPinnedNotes);
  };


  const openSearchDialog = useDialog(DialogType.SEARCH, setSearchValue);


  return <>
    <NoteViewHeader
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
              refreshNoteList={refreshContentViews}
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
          setNote={setActiveNote}
          setNoteTitle={
            (newTitle: string): void => {
              setActiveNote({
                ...activeNote,
                title: newTitle,
              });
            }
          }
          setNoteContent={setNoteContent}
          addFilesToNoteObject={(files: FileInfo[]): void => {
            setActiveNote((previousState) => {
              return {
                ...previousState,
                files: [...previousState.files, ...files],
              };
            });
          }}
          onLinkAddition={handleLinkAddition}
          onLinkRemoval={handleLinkRemoval}
          displayedLinkedNotes={displayedLinkedNotes}
          setUnsavedChanges={setUnsavedChanges}
          databaseProvider={databaseProvider}
          createNewNote={createNewNote}
          createNewLinkedNote={createNewLinkedNote}
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
          contentMode={contentMode}
          toggleEditMode={toggleEditMode}
        />
      </div>
    </main>
  </>;
};

export default NoteView;
