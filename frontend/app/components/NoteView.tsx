import React, {
  useEffect, useContext, useState,
} from "react";
import NoteViewHeader from "./NoteViewHeader";
import Note from "./Note";
import * as Utils from "../lib/utils";
import * as Config from "../config";
import {
  useNavigate, useParams, useSearchParams,
} from "react-router-dom";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import { PathTemplate } from "../enum/PathTemplate";
import useKeyboardShortcuts from "../hooks/useKeyboardShortcuts";
import { FileInfo } from "../../../lib/notes/interfaces/FileInfo";
import { ErrorMessage } from "../../../lib/notes/interfaces/ErrorMessage";
import ConfirmationServiceContext from "../contexts/ConfirmationServiceContext";
import { l } from "../lib/intl";
import NoteListWithControls from "./NoteListWithControls";
import { ContentMode } from "../types/ContentMode";
import * as IDB from "idb-keyval";
import useGoToNote from "../hooks/useGoToNote";
import useDatabaseProvider from "../hooks/useDatabaseProvider";
import useControlledNoteList from "../hooks/useControlledNoteList";
import useGraphId from "../hooks/useGraphId";
import useHeaderStats from "../hooks/useHeaderStats";
import useActiveNote from "../hooks/useActiveNote";
import usePinnedNotes from "../hooks/usePinnedNotes";


const NoteView = () => {
  const databaseProvider = useDatabaseProvider();
  const isSmallScreen = useIsSmallScreen();
  const navigate = useNavigate();
  const confirm = useContext(ConfirmationServiceContext) as (any) => void;
  const graphId = useGraphId();
  const { noteId } = useParams();
  const [urlSearchParams] = useSearchParams();

  const handleInvalidCredentialsError = async () => {
    await databaseProvider?.removeAccess();
    navigate(Utils.getAppPath(PathTemplate.LOGIN));
  };

  const {
    isBusy,
    activeNote,
    saveActiveNote,
    createNewNote,
    createNewLinkedNote,
    removeActiveNote,
    duplicateNote,
    loadNote,
    importNote,
    handleLinkAddition,
    handleLinkRemoval,
    displayedLinkedNotes,
    setActiveNote,
    setNoteContent,
    unsavedChanges,
    setUnsavedChanges,
  } = useActiveNote(databaseProvider, graphId, handleInvalidCredentialsError);

  const [headerStats, refreshHeaderStats] = useHeaderStats(
    databaseProvider,
    graphId,
  );

  const {
    pinnedNotes,
    pinOrUnpinNote,
    refreshPinnedNotes,
  } = usePinnedNotes(databaseProvider, graphId);

  const [contentMode, setContentMode] = useState<ContentMode>(
    ContentMode.LOADING,
  );
  const goToNote = useGoToNote();


  const toggleEditMode = async () => {
    if (contentMode === ContentMode.LOADING) return;

    const newContentMode = contentMode === ContentMode.EDITOR
      ? ContentMode.VIEWER
      : ContentMode.EDITOR;
    setContentMode(newContentMode);
    await IDB.set("CONTENT_MODE", newContentMode);

    if (newContentMode === ContentMode.EDITOR) {
      document.getElementById("editor")?.focus();
    }

    if (
      databaseProvider
      && newContentMode === ContentMode.VIEWER
      // @ts-ignore calling constructor via instance
      && databaseProvider.constructor.features.includes("GET_DOCUMENT_TITLE")
    ) {
      Utils.insertDocumentTitles(activeNote.content, databaseProvider)
        .then((newNoteContent) => {
          if (newNoteContent !== activeNote.content) {
            setNoteContent(newNoteContent);
          }
        });
    }
  };


  const controlledNoteList = useControlledNoteList(
    databaseProvider,
    graphId,
    handleInvalidCredentialsError,
  );


  const refreshContentViews = async (): Promise<void> => {
    try {
      await refreshHeaderStats();
      await controlledNoteList.refresh(graphId);
      await refreshPinnedNotes();
    } catch (e) {
      if (e instanceof Error && e.message !== "INVALID_CREDENTIALS") {
        throw new Error(e.message, { cause: e });
      }
    }
  };


  const saveActiveNoteAndRefreshViews = async (
    ignoreDuplicateTitles: boolean,
  ) => {
    const noteFromDatabase = await saveActiveNote(ignoreDuplicateTitles);
    await refreshContentViews();
    /*
      when saving the new note for the first time, we get its id from the
      databaseProvider. then we update the address bar to include the new id
    */
    goToNote(
      graphId,
      noteFromDatabase.meta.id,
      true,
    );

    return noteFromDatabase;
  };


  const handleNoteSaveRequest = async (): Promise<void> => {
    try {
      await saveActiveNoteAndRefreshViews(false);
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

        saveActiveNoteAndRefreshViews(true).catch((e) => {
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


  useEffect(() => {
    IDB.get("CONTENT_MODE")
      .then((value) => {
        let startContentMode;

        if (value === ContentMode.EDITOR) {
          startContentMode = ContentMode.EDITOR;
        } else if (value === ContentMode.VIEWER) {
          startContentMode = ContentMode.VIEWER;
        } else {
          startContentMode = Config.DEFAULT_CONTENT_MODE;
        }

        setContentMode(startContentMode);

        if (startContentMode === ContentMode.EDITOR) {
          setTimeout(() => {
            document.getElementById("editor")?.focus();
          });
        }
      })
      .catch(() => {
        setContentMode(Config.DEFAULT_CONTENT_MODE);
      });
  }, []);


  const getValidNoteId = (noteIdParam?: string): number | null => {
    if (
      noteIdParam
      && (noteIdParam !== "new")
      && !isNaN(parseInt(noteIdParam))
    ) {
      return parseInt(noteIdParam);
    } else {
      return null;
    }
  };


  const setCanonicalNewNotePath = () => {
    /* whatever has been written to the address bar, let's replace it with
    the canonical path for a new note */
    navigate(
      Utils.getAppPath(
        PathTemplate.NEW_NOTE,
        new Map([["GRAPH_ID", graphId]]),
        new URLSearchParams(location.search),
      ),
      { replace: true },
    );
  };


  useEffect(() => {
    refreshContentViews();

    if (typeof getValidNoteId(noteId) !== "number") {
      const fileIds = urlSearchParams.has("fileIds")
        ? (urlSearchParams.get("fileIds") as string).split(",")
        : [];

      createNewNote([], fileIds);
      setCanonicalNewNotePath();
    }
  }, []);


  useEffect(() => {
    const validNoteId = getValidNoteId(noteId);
    if (typeof validNoteId === "number") {
      loadNote(graphId, validNoteId);
    }
  }, [noteId]);

  return <>
    <NoteViewHeader
      stats={headerStats}
      pinnedNotes={pinnedNotes}
      activeNote={activeNote}
      graphId={graphId}
    />
    <main>
      {
        !isSmallScreen
          ? <div className="sidebar">
            <NoteListWithControls
              handleSearchInputChange={controlledNoteList.setSearchQuery}
              searchValue={controlledNoteList.searchQuery}
              sortMode={controlledNoteList.sortMode}
              handleSortModeChange={controlledNoteList.setSortMode}
              refreshContentViews={refreshContentViews}
              noteListItems={controlledNoteList.items}
              numberOfResults={controlledNoteList.numberOfResults}
              activeNote={activeNote}
              noteListIsBusy={controlledNoteList.isBusy}
              noteListScrollTop={controlledNoteList.scrollTop}
              setNoteListScrollTop={controlledNoteList.setScrollTop}
              page={controlledNoteList.page}
              setPage={controlledNoteList.setPage}
              stats={headerStats}
              itemsAreLinkable={true}
              onLinkAddition={handleLinkAddition}
              onLinkRemoval={handleLinkRemoval}
              displayedLinkedNotes={displayedLinkedNotes}
              graphId={graphId}
            />
          </div>
          : null
      }
      <div className="main-content-besides-sidebar">
        <Note
          isBusy={isBusy}
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
          createNewNote={() => {
            createNewNote();
            setCanonicalNewNotePath();
          }}
          createNewLinkedNote={() => {
            createNewLinkedNote();
            setCanonicalNewNotePath();
          }}
          handleNoteSaveRequest={handleNoteSaveRequest}
          removeActiveNote={async () => {
            await removeActiveNote();
            refreshContentViews();
            setCanonicalNewNotePath();
          }}
          unsavedChanges={unsavedChanges}
          pinOrUnpinNote={pinOrUnpinNote}
          duplicateNote={async () => {
            const duplicate = await duplicateNote();
            refreshContentViews();
            goToNote(graphId, duplicate.meta.id);
          }}
          openInGraphView={() => {
            if (activeNote.isUnsaved) {
              throw new Error("Cannot open an unsaved note in graph view");
            }

            navigate(
              Utils.getAppPath(
                PathTemplate.GRAPH_WITH_FOCUS_NOTE,
                new Map([
                  ["GRAPH_ID", graphId],
                  ["FOCUS_NOTE_ID", activeNote.id.toString()],
                ]),
              ),
            );
          }}
          contentMode={contentMode}
          toggleEditMode={toggleEditMode}
          importNote={importNote}
          graphId={graphId}
        />
      </div>
    </main>
  </>;
};

export default NoteView;
