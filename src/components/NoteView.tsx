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
import NotesProviderProxy from "../lib/notes-worker/NotesProviderProxy";
import { getNoteTitle } from "../lib/notes";
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
import useScriptExecutor from "../hooks/useScriptExecutor";
import NavigationRail from "./NavigationRail";
import {
  getCurrentNavigationState,
  navigateTo,
} from "../lib/navigation";


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
  const executeScript = useScriptExecutor();
  const [scriptRefreshTrigger, setScriptRefreshTrigger]
    = useState(0);

  const {
    activeNote,
    setActiveNote,
    isBusy,
    unsavedChanges,
    setUnsavedChanges,
    slugForm,
    editor: noteEditor,
    references,
    actions,
    externalChange,
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
    const noteFromDatabase = await actions.save();

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
      setScriptRefreshTrigger((prev) => prev + 1);
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
      navigateTo(targetPath, { history: "replace" });
    }
  };


  useKeyboardShortcuts({
    onSave: () => {
      if (!NotesProviderProxy.isValidNoteSlugOrEmpty(slugForm.input)) {
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
          getCurrentNavigationState<{ contentIfNewNote?: string }>()
            ?.contentIfNewNote || "",
      });
      setCanonicalNewNotePath();
    }
  });


  const loadNoteAndRefreshURL = async (
    slug?: Slug,
    contentIfNewNote?: string,
  ) => {
    if (slug === "new") {
      await actions.load(
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
      const receivedNoteSlug = await actions.load(
        validNoteSlug,
        contentIfNewNote,
      );
      if (
        typeof receivedNoteSlug === "string"
        && validNoteSlug !== receivedNoteSlug
      ) {
        navigateTo(
          Utils.getAppPath(
            PathTemplate.EXISTING_NOTE,
            new Map([
              ["GRAPH_ID", Config.LOCAL_GRAPH_ID],
              ["SLUG", receivedNoteSlug],
            ]),
            new URLSearchParams(location.search),
          ),
          { history: "replace" },
        );
      }
    }
  };


  useEffect(() => {
    loadNoteAndRefreshURL(
      slug,
      getCurrentNavigationState<{ contentIfNewNote?: string }>()
        ?.contentIfNewNote,
    );
  }, [slug]);


  useEffect(() => {
    const listener = (e: { event: string }) => {
      if (e.event !== "mutation") return;
      refreshContentViews();
      externalChange.check();
    };
    notesProvider.subscribe(listener);
    return () => notesProvider.unsubscribe(listener);
  }, [notesProvider, activeNote]);

  return <div className="view note-view">
    <NavigationRail activeView="notes" />
    <NoteViewHeader
      stats={headerStats}
      pinnedNotes={pinnedNotes}
      movePin={move}
      activeNote={activeNote}
    />
    <main className="note-view-content">
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
        {externalChange.state ? (
          <div
            className="external-change-banner"
            role="status"
          >
            <span>
              {externalChange.state.kind === "deleted"
                ? l("editor.external-change.deleted")
                : l("editor.external-change.modified")}
            </span>
            <div className="external-change-banner-actions">
              <button
                type="button"
                onClick={() => {
                  if (externalChange.state?.kind === "deleted") {
                    externalChange.dismiss();
                    setUnsavedChanges(false);
                    goToNote("new");
                  } else {
                    externalChange.reload();
                  }
                }}
              >
                {externalChange.state.kind === "deleted"
                  ? l("editor.external-change.reload-deleted")
                  : l("editor.external-change.reload")}
              </button>
              <button
                type="button"
                onClick={externalChange.dismiss}
              >
                {l("editor.external-change.dismiss")}
              </button>
            </div>
          </div>
        ) : null}
        <Note
          editorInstanceId={noteEditor.instanceId}
          isBusy={isBusy}
          note={activeNote}
          setSlugInput={slugForm.setInput}
          slugInput={slugForm.input}
          displayedSlugAliases={slugForm.aliases}
          setDisplayedSlugAliases={slugForm.setAliases}
          handleEditorContentChange={noteEditor.handleContentChange}
          addFilesToNoteObject={(files: Set<FileInfo>): void => {
            setActiveNote((previousState) => {
              return {
                ...previousState,
                files: new Set([...previousState.files, ...files]),
              };
            });
          }}
          setUnsavedChanges={setUnsavedChanges}
          handleNoteSaveRequest={handleNoteSaveRequest}
          removeActiveNote={async () => {
            await actions.remove();
            refreshContentViews();
            setCanonicalNewNotePath();
          }}
          unsavedChanges={unsavedChanges}
          pinOrUnpinNote={pinOrUnpinNote}
          duplicateNote={async () => {
            const duplicate = await actions.duplicate();
            refreshContentViews();
            goToNote(duplicate.meta.slug);
            noteEditor.updateInstance();
          }}
          importNote={actions.importFromFile}
          uploadInProgress={uploadInProgress}
          setUploadInProgress={setUploadInProgress}
          updateReferences={references.update}
          setUpdateReferences={references.setUpdate}
          onLinkIndicatorClick={(slug: Slug, title: string) => {
            const wikilink = Utils.getWikilinkForNote(slug, title);
            insert(wikilink, editor);
          }}
          handleNoteExportRequest={actions.exportToFile}
          loadNote={actions.load}
          executeScript={executeScript}
          scriptRefreshTrigger={scriptRefreshTrigger}
        />
      </div>
    </main>
  </div>;
};


const NoteViewWithEditorContext = ({ slug }: NoteViewProps) => {
  return <Context>
    <NoteView slug={slug} />
  </Context>;
};

export default NoteViewWithEditorContext;
