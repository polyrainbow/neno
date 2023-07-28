import {
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
import { FileInfo } from "../lib/notes/interfaces/FileInfo";
import { ErrorMessage } from "../lib/notes/interfaces/ErrorMessage";
import ConfirmationServiceContext from "../contexts/ConfirmationServiceContext";
import { l } from "../lib/intl";
import NoteListWithControls from "./NoteListWithControls";
import { ContentMode } from "../types/ContentMode";
import * as IDB from "idb-keyval";
import useGoToNote from "../hooks/useGoToNote";
import useNotesProvider from "../hooks/useNotesProvider";
import useControlledNoteList from "../hooks/useControlledNoteList";
import useHeaderStats from "../hooks/useHeaderStats";
import useActiveNote from "../hooks/useActiveNote";
import usePinnedNotes from "../hooks/usePinnedNotes";
import { Slug } from "../lib/notes/interfaces/Slug";
import { inferNoteTitle } from "../lib/notes/noteUtils";
import { removeAccess } from "../lib/LocalDataStorage";
import NotesProvider from "../lib/notes";


const getValidNoteSlug = (
  noteSlugParam?: string,
): Slug | "random" | null => {
  if (noteSlugParam === "random") {
    return "random";
  }

  if (
    noteSlugParam
    && (noteSlugParam !== "new")
    && noteSlugParam.length > 0
  ) {
    return noteSlugParam;
  } else {
    return null;
  }
};


const NoteView = () => {
  const notesProvider = useNotesProvider();
  const isSmallScreen = useIsSmallScreen();
  const navigate = useNavigate();
  const confirm = useContext(ConfirmationServiceContext) as (val: any) => void;
  const { slug } = useParams();
  const [urlSearchParams] = useSearchParams();
  const [uploadInProgress, setUploadInProgress] = useState<boolean>(false);

  const handleInvalidCredentialsError = async () => {
    await removeAccess();
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
    setActiveNote,
    setNoteContent,
    unsavedChanges,
    setUnsavedChanges,
    slugInput,
    setSlugInput,
    editorInstanceId,
    updateEditorInstance,
  } = useActiveNote(notesProvider, handleInvalidCredentialsError);

  const [headerStats, refreshHeaderStats] = useHeaderStats(notesProvider);

  const {
    pinnedNotes,
    pinOrUnpinNote,
    refreshPinnedNotes,
  } = usePinnedNotes(notesProvider);

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
      document.querySelector<HTMLDivElement>(
        "div[data-lexical-editor]",
      )?.focus();
    }
  };


  const controlledNoteList = useControlledNoteList(
    notesProvider,
    handleInvalidCredentialsError,
  );


  const refreshContentViews = async (): Promise<void> => {
    try {
      await refreshHeaderStats();
      await controlledNoteList.refresh();
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

    /*
      When saving a new note for the first time, we get its id from the
      notesProvider. Then we update the address bar to include the new id.
      We're using requestIdleCallback because we first want to let React
      update all the states, so that when this goToNote function triggers an
      effect, we then can work with the updated changes.
    */
    requestIdleCallback(() => {
      goToNote(
        noteFromDatabase.meta.slug,
        true,
      );
    });

    /*
      Order matters here: We want to goToNote before refreshing content views
      for higher perceived performance. refreshContentViews is nice to have
      but not necessary to continue editing the active note.
    */

    await refreshContentViews();
    return noteFromDatabase;
  };


  const handleNoteSaveRequest = async (): Promise<void> => {
    setUploadInProgress(true);
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
    setUploadInProgress(false);
  };


  const setCanonicalNewNotePath = () => {
    /* whatever has been written to the address bar, let's replace it with
    the canonical path for a new note */
    navigate(
      Utils.getAppPath(
        PathTemplate.NEW_NOTE,
        new Map([["GRAPH_ID", Config.LOCAL_GRAPH_ID]]),
        new URLSearchParams(location.search),
      ),
      { replace: true },
    );
  };


  useKeyboardShortcuts({
    onSave: () => {
      if (!NotesProvider.isValidSlug(slugInput) && slugInput.length > 0) {
        return;
      }
      handleNoteSaveRequest();
    },
    onCmdB: () => {
      createNewNote({});
      setCanonicalNewNotePath();
    },
  });


  useEffect(() => {
    const title = activeNote.keyValues.find((kv) => kv[0] === "title")?.[1]
      ?? inferNoteTitle(activeNote.content);

    const documentTitle = title.length > 0
      ? title
      : activeNote.isUnsaved
        ? l("editor.new-note")
        : l("list.untitled-note");

    if (document.title !== documentTitle) {
      document.title = documentTitle;
    }

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
            document.querySelector<HTMLDivElement>(
              "div[data-lexical-editor]",
            )?.focus();
          });
        }
      })
      .catch(() => {
        setContentMode(Config.DEFAULT_CONTENT_MODE);
      });
  }, []);


  useEffect(() => {
    refreshContentViews();

    if (getValidNoteSlug(slug) === null) {
      const fileIds = urlSearchParams.has("fileIds")
        ? (urlSearchParams.get("fileIds") as string).split(",")
        : [];

      createNewNote({
        content: Utils.createContentFromFileIds(fileIds),
      });
      setCanonicalNewNotePath();
    }
  }, []);


  useEffect(() => {
    const loadNoteAndRefreshURL = async () => {
      const validNoteSlug = getValidNoteSlug(slug);
      if (
        validNoteSlug !== null
        /*
          We don't want to react on a note id change in the url if that
          note is already loaded. This might happen when saving a new note for
          the first time:
          The note id changes from "new" to "123", which triggers this effect.
          But we got the content already from the call to saveActiveNote().
          So if we already have a noteId and it is the same one, don't reload!
        */
        && (!(
          "slug" in activeNote
          && validNoteSlug === activeNote.slug
        ))
      ) {
        const receivedNoteSlug = await loadNote(validNoteSlug);
        if (
          typeof receivedNoteSlug === "string"
          && validNoteSlug !== receivedNoteSlug
        ) {
          navigate(
            Utils.getAppPath(
              PathTemplate.EXISTING_NOTE,
              new Map([
                ["GRAPH_ID", Config.LOCAL_GRAPH_ID],
                ["SLUG", receivedNoteSlug],
              ]),
              new URLSearchParams(location.search),
            ),
            { replace: true },
          );
        }
      }
    };

    loadNoteAndRefreshURL();
  }, [slug]);

  return <>
    <NoteViewHeader
      stats={headerStats}
      pinnedNotes={pinnedNotes}
      activeNote={activeNote}
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
              onLinkIndicatorClick={(slug: Slug) => {
                let newNoteContent;

                if (
                  activeNote.content === ""
                  || activeNote.content.trimEnd() !== activeNote.content
                ) {
                  newNoteContent = activeNote.content + `[[${slug}]]`;
                } else {
                  newNoteContent = activeNote.content + ` [[${slug}]]`;
                }

                setNoteContent(newNoteContent, true);
              }}
            />
          </div>
          : null
      }
      <div className="main-content-besides-sidebar">
        <Note
          isBusy={isBusy}
          note={activeNote}
          editorInstanceId={editorInstanceId}
          setNote={setActiveNote}
          setSlugInput={setSlugInput}
          slugInput={slugInput}
          setNoteContent={setNoteContent}
          addFilesToNoteObject={(files: FileInfo[]): void => {
            setActiveNote((previousState) => {
              return {
                ...previousState,
                files: [...previousState.files, ...files],
              };
            });
          }}
          setUnsavedChanges={setUnsavedChanges}
          createNewNote={(params) => {
            createNewNote(params);
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
            goToNote(duplicate.meta.slug);
            updateEditorInstance();
          }}
          openInGraphView={() => {
            if (activeNote.isUnsaved) {
              throw new Error("Cannot open an unsaved note in graph view");
            }

            navigate(
              Utils.getAppPath(
                PathTemplate.GRAPH_WITH_FOCUS_NOTE,
                new Map([
                  ["GRAPH_ID", Config.LOCAL_GRAPH_ID],
                  ["FOCUS_NOTE_SLUG", activeNote.slug],
                ]),
              ),
            );
          }}
          contentMode={contentMode}
          toggleEditMode={toggleEditMode}
          importNote={importNote}
          uploadInProgress={uploadInProgress}
          setUploadInProgress={setUploadInProgress}
        />
      </div>
    </main>
  </>;
};

export default NoteView;
