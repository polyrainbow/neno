import {
  useEffect, useState,
} from "react";
import NoteViewHeader from "./NoteViewHeader";
import Note from "./Note";
import * as Utils from "../lib/utils";
import * as Config from "../config";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import useKeyboardShortcuts from "../hooks/useKeyboardShortcuts";
import { FileInfo } from "../lib/notes/types/FileInfo";
import { l } from "../lib/intl";
import NoteListWithControls from "./NoteListWithControls";
import useNotesProvider from "../hooks/useNotesProvider";
import useControlledNoteList from "../hooks/useControlledNoteList";
import useHeaderStats from "../hooks/useHeaderStats";
import useActiveNote from "../hooks/useActiveNote";
import usePinnedNotes from "../hooks/usePinnedNotes";
import { Slug } from "../lib/notes/types/Slug";
import NotesProvider, { getNoteTitle } from "../lib/notes";
import { Context } from "../lib/editor";
import useGoToNote from "../hooks/useGoToNote";
import { PathTemplate } from "../types/PathTemplate";
import { insert, toggleWikilinkWrap } from "../lib/editorManipulations";
import {
  useLexicalComposerContext,
} from "@lexical/react/LexicalComposerContext";
import useConfirmDiscardingUnsavedChangesDialog
  from "../hooks/useConfirmDiscardingUnsavedChangesDialog";
import useRunOnce from "../hooks/useRunOnce";


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

interface NoteViewProps {
  slug: Slug,
}

const NoteView = ({ slug }: NoteViewProps) => {
  const notesProvider = useNotesProvider();
  const isSmallScreen = useIsSmallScreen();
  const [uploadInProgress, setUploadInProgress] = useState<boolean>(false);
  const goToNote = useGoToNote();
  const [editor] = useLexicalComposerContext();
  const confirmDiscardingUnsavedChanges
    = useConfirmDiscardingUnsavedChangesDialog();

  const {
    isBusy,
    activeNote,
    saveActiveNote,
    removeActiveNote,
    duplicateNote,
    loadNote,
    importNote,
    setActiveNote,
    handleEditorContentChange,
    unsavedChanges,
    setUnsavedChanges,
    slugInput,
    setSlugInput,
    displayedSlugAliases,
    setDisplayedSlugAliases,
    editorInstanceId,
    updateEditorInstance,
    updateReferences,
    setUpdateReferences,
    handleNoteExportRequest,
  } = useActiveNote(notesProvider);

  const [headerStats, refreshHeaderStats] = useHeaderStats(notesProvider);

  const {
    pinnedNotes,
    pinOrUnpinNote,
    refreshPinnedNotes,
    move,
  } = usePinnedNotes(notesProvider);
  const controlledNoteList = useControlledNoteList(notesProvider);

  const refreshContentViews = async (): Promise<void> => {
    await controlledNoteList.refresh();
    await refreshPinnedNotes();
    /*
      Header stats are rather expensive and have lower priority than the note
      list, so we wait until we have capacity. This increases INP significantly.
    */
    requestIdleCallback(async () => {
      await refreshHeaderStats();
    });
  };

  const saveActiveNoteAndRefreshViews = async () => {
    const noteFromDatabase = await saveActiveNote();

    goToNote(
      noteFromDatabase.meta.slug,
      {
        replace: true,
      },
    );

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
      await saveActiveNoteAndRefreshViews();
    } catch (e) {
      alert(e);
    }
    setUploadInProgress(false);
  };


  const setCanonicalNewNotePath = () => {
    const targetPath = Utils.getAppPath(
      PathTemplate.NEW_NOTE,
      new Map([["GRAPH_ID", Config.LOCAL_GRAPH_ID]]),
      new URLSearchParams(location.search),
    );

    if (location.pathname !== targetPath) {
      /* whatever has been written to the address bar, let's replace it with
      the canonical path for a new note */
      // @ts-ignore
      navigation.navigate(
        targetPath,
        {
          replace: true,
        },
      );
    }
  };


  useKeyboardShortcuts({
    onSave: () => {
      if (!NotesProvider.isValidNoteSlugOrEmpty(slugInput)) {
        return;
      }
      handleNoteSaveRequest();
    },
    onCmdB: async () => {
      if (unsavedChanges) {
        await confirmDiscardingUnsavedChanges();
        setUnsavedChanges(false);
      }
      goToNote("new");
    },
    onCmdE: () => {
      document.getElementById("search-input")?.focus();
    },
    onCmdI: () => {
      toggleWikilinkWrap(editor);
    },
  });


  useEffect(() => {
    const title = getNoteTitle(activeNote.initialContent);

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


  useRunOnce(() => {
    refreshContentViews();

    if (getValidNoteSlug(slug) === null) {
      goToNote("new", {
        contentIfNewNote:
          // @ts-ignore
          navigation.currentEntry.getState()?.contentIfNewNote || "",
      });
      setCanonicalNewNotePath();
    }
  });


  const loadNoteAndRefreshURL = async (
    slug?: Slug,
    contentIfNewNote?: string,
  ) => {
    if (slug === "new") {
      await loadNote(
        slug,
        contentIfNewNote || "",
      );
    }

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
      const receivedNoteSlug = await loadNote(
        validNoteSlug,
        contentIfNewNote,
      );
      if (
        typeof receivedNoteSlug === "string"
        && validNoteSlug !== receivedNoteSlug
      ) {
        // @ts-ignore
        navigation.navigate(
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


  useEffect(() => {
    loadNoteAndRefreshURL(
      slug,
      // @ts-ignore
      navigation.currentEntry.getState()?.contentIfNewNote,
    );
  }, [slug]);

  return <>
    <NoteViewHeader
      stats={headerStats}
      pinnedNotes={pinnedNotes}
      movePin={move}
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
              itemsAreLinkable={true}
              onLinkIndicatorClick={(slug: Slug, title: string) => {
                const wikilink = Utils.getWikilinkForNote(slug, title);
                insert(wikilink, editor);
              }}
              selectedIndex={controlledNoteList.selectedIndex}
              setSelectedIndex={controlledNoteList.setSelectedIndex}
            />
          </div>
          : null
      }
      <div className="main-content-besides-sidebar">
        <Note
          editorInstanceId={editorInstanceId}
          isBusy={isBusy}
          note={activeNote}
          setSlugInput={setSlugInput}
          slugInput={slugInput}
          displayedSlugAliases={displayedSlugAliases}
          setDisplayedSlugAliases={setDisplayedSlugAliases}
          handleEditorContentChange={handleEditorContentChange}
          addFilesToNoteObject={(files: FileInfo[]): void => {
            setActiveNote((previousState) => {
              return {
                ...previousState,
                files: [...previousState.files, ...files],
              };
            });
          }}
          setUnsavedChanges={setUnsavedChanges}
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
            insert(wikilink, editor);
          }}
          handleNoteExportRequest={handleNoteExportRequest}
        />
      </div>
    </main>
  </>;
};


const NoteViewWithEditorContext = ({ slug }: NoteViewProps) => {
  return <Context>
    <NoteView slug={slug} />
  </Context>;
};

export default NoteViewWithEditorContext;
