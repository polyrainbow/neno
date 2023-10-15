import {
  useEffect, useState,
} from "react";
import NoteViewHeader from "./NoteViewHeader";
import Note from "./Note";
import * as Utils from "../lib/utils";
import * as Config from "../config";
import {
  useNavigate, useParams, useSearchParams,
} from "react-router-dom";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import { PathTemplate } from "../types/PathTemplate";
import useKeyboardShortcuts from "../hooks/useKeyboardShortcuts";
import { FileInfo } from "../lib/notes/types/FileInfo";
import { ErrorMessage } from "../lib/notes/types/ErrorMessage";
import { l } from "../lib/intl";
import NoteListWithControls from "./NoteListWithControls";
import useGoToNote from "../hooks/useGoToNote";
import useNotesProvider from "../hooks/useNotesProvider";
import useControlledNoteList from "../hooks/useControlledNoteList";
import useHeaderStats from "../hooks/useHeaderStats";
import useActiveNote from "../hooks/useActiveNote";
import usePinnedNotes from "../hooks/usePinnedNotes";
import { Slug } from "../lib/notes/types/Slug";
import NotesProvider from "../lib/notes";
import useConfirm from "../hooks/useConfirm";


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

const insertModule: { insert?: (text: string) => void } = {};

const NoteView = () => {
  const notesProvider = useNotesProvider();
  const isSmallScreen = useIsSmallScreen();
  const navigate = useNavigate();
  const confirm = useConfirm();
  const { slug } = useParams();
  const [urlSearchParams] = useSearchParams();
  const [uploadInProgress, setUploadInProgress] = useState<boolean>(false);

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
    updateReferences,
    setUpdateReferences,
  } = useActiveNote(notesProvider);

  const [headerStats, refreshHeaderStats] = useHeaderStats(notesProvider);

  const {
    pinnedNotes,
    pinOrUnpinNote,
    refreshPinnedNotes,
  } = usePinnedNotes(notesProvider);
  const goToNote = useGoToNote();
  const controlledNoteList = useControlledNoteList(notesProvider);

  const refreshContentViews = async (): Promise<void> => {
    await refreshHeaderStats();
    await controlledNoteList.refresh();
    await refreshPinnedNotes();
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
    const title = Utils.getNoteTitleFromActiveNote(activeNote);

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
    setTimeout(() => {
      document.querySelector<HTMLDivElement>(
        "div[data-lexical-editor]",
      )?.focus();
    });
  }, []);


  useEffect(() => {
    refreshContentViews();

    if (getValidNoteSlug(slug) === null) {
      const slugs = urlSearchParams.has("referenceSlugs")
        ? (urlSearchParams.get("referenceSlugs") as string).split(",")
        : [];

      createNewNote({
        content: Utils.createContentFromSlugs(slugs),
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
              noteListItems={controlledNoteList.items}
              numberOfResults={controlledNoteList.numberOfResults}
              activeNote={activeNote}
              noteListIsBusy={controlledNoteList.isBusy}
              noteListScrollTop={controlledNoteList.scrollTop}
              setNoteListScrollTop={controlledNoteList.setScrollTop}
              page={controlledNoteList.page}
              setPage={controlledNoteList.setPage}
              numberOfAllNotes={headerStats?.numberOfAllNotes}
              itemsAreLinkable={true}
              onLinkIndicatorClick={(slug: Slug, title: string) => {
                const wikilink = Utils.getWikilinkForNote(slug, title);
                insertModule.insert?.(wikilink);
              }}
            />
          </div>
          : null
      }
      <div className="main-content-besides-sidebar">
        <Note
          insertModule={insertModule}
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
          importNote={importNote}
          uploadInProgress={uploadInProgress}
          setUploadInProgress={setUploadInProgress}
          updateReferences={updateReferences}
          setUpdateReferences={setUpdateReferences}
          onLinkIndicatorClick={(slug: Slug, title: string) => {
            const wikilink = Utils.getWikilinkForNote(slug, title);
            insertModule.insert?.(wikilink);
          }}
        />
      </div>
    </main>
  </>;
};

export default NoteView;
