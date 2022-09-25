import React, { useEffect, useState } from "react";
import NoteView from "./NoteView";
import ListView from "./ListView";
import GraphView from "./GraphView";
import LoginView from "./LoginView";
import ConfirmationServiceProvider from "./ConfirmationServiceProvider";
import AppMenu from "./AppMenu";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import FloatingActionButton from "./FloatingActionButton";
import { DatabaseMode } from "../enum/DatabaseMode";
import StatsView from "./StatsView";
import FilesView from "./FilesView";
import FileView from "./FileView";
import { getAppPath, getNoteTitleFromContent } from "../lib/utils";
import { PathTemplate } from "../enum/PathTemplate";
import DialogServiceProvider from "./DialogServiceProvider";
import { l } from "../lib/intl";
import {
  NoteListSortMode,
} from "../../../lib/notes/interfaces/NoteListSortMode";
import DatabaseProvider from "../interfaces/DatabaseProvider";
import NoteToTransmit from "../../../lib/notes/interfaces/NoteToTransmit";
import useWarnBeforeUnload from "../hooks/useWarnBeforeUnload";
import useHeaderStats from "../hooks/useHeaderStats";
import useNoteList from "../hooks/useNoteList";
import { GraphId } from "../../../lib/notes/interfaces/GraphId";
import { FileInfo } from "../../../lib/notes/interfaces/FileInfo";
import ActiveNote, { UnsavedActiveNote } from "../interfaces/ActiveNote";
import * as Utils from "../lib/utils";
import useGoToNote from "../hooks/useGoToNote";
import { NoteId } from "../../../lib/notes/interfaces/NoteId";
import useConfirmDiscardingUnsavedChangesDialog
  from "../hooks/useConfirmDiscardingUnsavedChangesDialog";
import FrontendUserNoteChange, { FrontendUserNoteChangeNote }
  from "../interfaces/FrontendUserNoteChange";
import UserNoteChange from "../../../lib/notes/interfaces/UserNoteChange";
import * as Config from "../config";
import {
  UserNoteChangeType,
} from "../../../lib/notes/interfaces/UserNoteChangeType";
import {
  NewNoteSaveRequest,
  NoteSaveRequest,
} from "../../../lib/notes/interfaces/NoteSaveRequest";
import { ContentMode } from "../interfaces/ContentMode";
import * as IDB from "idb-keyval";
import { utils } from "../../../lib/notes";

interface AppProps {
  localDatabaseProvider: DatabaseProvider,
  serverDatabaseProvider: DatabaseProvider,
}


const AppWithConfirmationServiceProvider = ({
  localDatabaseProvider,
  serverDatabaseProvider,
}: AppProps) => {
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
  const [isAppMenuOpen, setIsAppMenuOpen] = useState<boolean>(false);
  const [databaseMode, setDatabaseMode]
    = useState<DatabaseMode>(DatabaseMode.NONE);

  const newNoteObject: UnsavedActiveNote = Utils.getNewNoteObject([]);
  const [activeNote, setActiveNote] = useState<ActiveNote>(newNoteObject);
  /* The value of this ref can be set to add linked notes to newly created
  notes. it is always reset after creating a new note */

  const databaseProvider: DatabaseProvider | null
    = databaseMode === DatabaseMode.LOCAL
      ? localDatabaseProvider
      : (
        databaseMode === DatabaseMode.SERVER
          ? serverDatabaseProvider
          : null
      );


  const location = useLocation();
  const goToNote = useGoToNote();
  const pathname = location.pathname;
  const pathContainsActiveNoteId = /\/editor\/([0-9]+)/g.exec(pathname);
  const activeNoteId: NoteId | "new" = pathContainsActiveNoteId
    ? parseInt(pathContainsActiveNoteId[1])
    : "new";

  const [noteListScrollTop, setNoteListScrollTop] = useState<number>(0);
  const [sortMode, setSortMode] = useState<NoteListSortMode>(
    NoteListSortMode.UPDATE_DATE_DESCENDING,
  );
  const [searchValue, setSearchValue] = useState<string>("");
  const [pinnedNotes, setPinnedNotes] = useState<NoteToTransmit[]>([]);
  const navigate = useNavigate();
  const isSmallScreen = useIsSmallScreen();
  const [headerStats, refreshHeaderStats] = useHeaderStats(databaseProvider);
  const [page, setPage] = useState<number>(1);

  const [contentMode, setContentMode] = useState<ContentMode>(
    ContentMode.LOADING,
  );

  const handleSearchInputChange = (value) => {
    setSearchValue(value);
    setNoteListScrollTop(0);
    setPage(1);
  };


  const setNewNote = (
    linkedNotes: FrontendUserNoteChangeNote[],
    files?: FileInfo[],
  ) => {
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

    const newNoteObject: UnsavedActiveNote
      = Utils.getNewNoteObject(
        linkedNotes,
        files,
      );
    setActiveNote(newNoteObject);
  };


  const handleInvalidCredentialsError = async () => {
    await databaseProvider?.removeAccess();
    setDatabaseMode(DatabaseMode.NONE);
    navigate(getAppPath(PathTemplate.LOGIN));
  };


  const setActiveNoteFromServer = (noteFromServer: NoteToTransmit): void => {
    setActiveNote({
      id: noteFromServer.meta.id,
      title: noteFromServer.meta.title,
      createdAt: noteFromServer.meta.createdAt,
      updatedAt: noteFromServer.meta.updatedAt,
      position: noteFromServer.meta.position,
      linkedNotes: noteFromServer.linkedNotes,
      numberOfCharacters: noteFromServer.numberOfCharacters,
      isUnsaved: false,
      changes: [],
      content: noteFromServer.content,
      files: noteFromServer.files,
      keyValues: Object.entries(noteFromServer.meta.custom),
      flags: noteFromServer.meta.flags,
      contentType: noteFromServer.meta.contentType,
    });
  };


  const loadNote = async (noteId: NoteId): Promise<void> => {
    if (!databaseProvider) {
      throw new Error("loadNote: No database provider loaded");
    }

    try {
      const noteFromServer = await databaseProvider.getNote(noteId);
      if (noteFromServer) {
        setActiveNoteFromServer(noteFromServer);
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
  };


  const [
    noteListItems,
    numberOfResults,
    noteListIsBusy,
    refreshNoteList,
  ] = useNoteList(databaseProvider, {
    searchValue,
    sortMode,
    page,
    handleInvalidCredentialsError,
  });


  const refreshContentViews = (): void => {
    refreshHeaderStats();
    refreshNoteList()
      .then(() => {
        databaseProvider?.getPins()
          .then((pinnedNotes) => setPinnedNotes(pinnedNotes))
          .catch((e) => {
            if (e.message !== "INVALID_CREDENTIALS") {
              throw new Error(e);
            }
          });
      });
  };


  const handleSortModeChange = (sortMode: NoteListSortMode): void => {
    setNoteListScrollTop(0);
    setSortMode(sortMode);
    setPage(1);
  };


  useEffect(() => {
    refreshContentViews();
  }, [searchValue, page, sortMode, databaseProvider]);


  useWarnBeforeUnload(unsavedChanges);


  const toggleAppMenu = () => {
    setIsAppMenuOpen(!isAppMenuOpen);
  };

  useEffect(() => {
    if (!databaseProvider) return;
    if (activeNoteId !== "new") {
      loadNote(activeNoteId);
    }
  }, [activeNoteId, databaseProvider]);


  const createOneNotePerLine = async (lines: string[]): Promise<void> => {
    const promises = lines.map((line) => {
      const noteSaveRequest: NoteSaveRequest = {
        note: {
          meta: {
            title: getNoteTitleFromContent(line),
            contentType: Config.DEFAULT_CONTENT_TYPE,
            flags: ["CREATED_VIA_ONE_NOTE_PER_LINE"],
            custom: {},
          },
          content: line,
        },
        ignoreDuplicateTitles: true,
      };
      return databaseProvider?.putNote(noteSaveRequest);
    });
    await Promise.all(promises);
    refreshContentViews();
  };


  const switchGraphs = (graphId: GraphId): void => {
    databaseProvider?.setActiveGraph?.(graphId);
    navigate(
      isSmallScreen
        ? getAppPath(PathTemplate.LIST)
        : getAppPath(PathTemplate.EDITOR_WITH_NEW_NOTE),
    );
    refreshContentViews();
  };


  const checkAuthentication = async () => {
    if (await serverDatabaseProvider.isAuthenticated?.()) {
      setDatabaseMode(DatabaseMode.SERVER);
      if (
        location.pathname.startsWith(getAppPath(PathTemplate.LOGIN))
        || location.pathname === "/"
      ) {
        navigate(
          isSmallScreen
            ? getAppPath(PathTemplate.LIST)
            : getAppPath(PathTemplate.EDITOR_WITH_NEW_NOTE),
        );
      }
    } else {
      navigate(getAppPath(PathTemplate.LOGIN));
    }
  };

  const confirmDiscardingUnsavedChanges
    = useConfirmDiscardingUnsavedChangesDialog();


  const createNewNote = async (
    linkedNotes?: FrontendUserNoteChangeNote[],
    files?: FileInfo[],
    useForce?: boolean,
  ) => {
    if (unsavedChanges && (!useForce)) {
      await confirmDiscardingUnsavedChanges();
      setUnsavedChanges(false);
    }

    // if the active note is already NaN, we need to manually reload the note
    // because navigating to it again won't change the state at all
    if (activeNoteId === "new") {
      setNewNote(linkedNotes || [], files);
    } else {
      navigate(Utils.getAppPath(PathTemplate.EDITOR_WITH_NEW_NOTE));
      setNewNote(linkedNotes || [], files);
    }
  };


  const createNewLinkedNote = () => {
    if (activeNote.isUnsaved) {
      throw new Error("Cannot create linked note of unsaved note");
    }

    const linkedNote: FrontendUserNoteChangeNote = {
      id: activeNote.id,
      updatedAt: activeNote.updatedAt,
      title: activeNote.title,
    };

    createNewNote([linkedNote]);
  };


  const importNote = async (): Promise<void> => {
    if (!databaseProvider) throw new Error("DatabaseProvider not ready!");

    if (unsavedChanges) {
      await confirmDiscardingUnsavedChanges();
    }

    const types = [{
      description: "NENO note",
      accept: { "application/neno-note": [".neno"] },
    }];

    const [rawNoteFile] = await Utils.getFilesFromUserSelection(types, false);
    const rawNote = await Utils.readFileAsString(rawNoteFile);

    try {
      const parsedNote = utils.parseSerializedNewNote(rawNote);
      const newActiveNote: UnsavedActiveNote = {
        isUnsaved: true,
        title: parsedNote.meta.title,
        changes: [],
        content: parsedNote.content,
        keyValues: Object.entries(parsedNote.meta.custom),
        flags: [...parsedNote.meta.flags, "IMPORTED"],
        contentType: parsedNote.meta.contentType,
        files: [],
      };
      setActiveNote(newActiveNote);
      setUnsavedChanges(true);
    } catch (e) {
      // if credentials are invalid, go to LoginView. If not, throw.
      if (e instanceof Error && e.message === "INVALID_CREDENTIALS") {
        await handleInvalidCredentialsError();
      } else {
        throw e;
      }
    }
  };


  const removeActiveNote = async () => {
    if (activeNote.isUnsaved) {
      return;
    }

    await databaseProvider?.deleteNote(activeNote.id);
    refreshContentViews();
    // using force here because a delete prompt dialog has already been shown
    createNewNote([], [], true);
    setUnsavedChanges(false);
  };


  const prepareNoteSaveRequest = async (
    ignoreDuplicateTitles: boolean,
  ): Promise<NoteSaveRequest> => {
    const noteSaveRequest = {
      note: {
        content: activeNote.content,
        meta: activeNote.isUnsaved
          ? {
            title: activeNote.title,
            custom: Object.fromEntries(activeNote.keyValues),
            flags: activeNote.flags,
            contentType: activeNote.contentType,
          }
          : {
            title: activeNote.title,
            custom: Object.fromEntries(activeNote.keyValues),
            id: activeNote.id,
            position: activeNote.position,
            createdAt: activeNote.createdAt,
            updatedAt: activeNote.updatedAt,
            flags: activeNote.flags,
            contentType: activeNote.contentType,
          },
      },
      changes: activeNote.changes.map(
        (change: FrontendUserNoteChange): UserNoteChange => {
          return {
            type: change.type,
            noteId: change.noteId,
          };
        }),
      ignoreDuplicateTitles,
    };

    Utils.setNoteTitleByContentIfUnset(
      noteSaveRequest.note,
      Config.DEFAULT_NOTE_TITLE,
    );

    return noteSaveRequest;
  };


  const saveActiveNote = async (
    ignoreDuplicateTitles: boolean,
  ): Promise<void> => {
    if (!databaseProvider) {
      throw new Error("saveActiveNote: No database provider loaded");
    }
    const noteSaveRequest = await prepareNoteSaveRequest(ignoreDuplicateTitles);
    const noteFromDatabase = await databaseProvider.putNote(
      noteSaveRequest,
    );
    setActiveNote({
      isUnsaved: false,
      id: noteFromDatabase.meta.id,
      title: noteFromDatabase.meta.title,
      content: noteFromDatabase.content,
      createdAt: noteFromDatabase.meta.createdAt,
      updatedAt: noteFromDatabase.meta.updatedAt,
      linkedNotes: noteFromDatabase.linkedNotes,
      position: noteFromDatabase.meta.position,
      numberOfCharacters: noteFromDatabase.numberOfCharacters,
      files: noteFromDatabase.files,
      changes: [],
      keyValues: Object.entries(noteFromDatabase.meta.custom),
      flags: noteFromDatabase.meta.flags,
      contentType: noteFromDatabase.meta.contentType,
    });
    setUnsavedChanges(false);
    refreshContentViews();
    /*
      when saving the new note for the first time, we get its id from the
      databaseProvider. then we update the address bar to include the new id
    */
    goToNote(noteFromDatabase.meta.id, true);
  };


  const duplicateNote = async () => {
    if (!databaseProvider) {
      throw new Error("duplicateNote: No database provider loaded");
    }
    if (activeNote.isUnsaved) return;

    if (unsavedChanges) {
      await confirmDiscardingUnsavedChanges();
      setUnsavedChanges(false);
    }

    const noteSaveRequest: NewNoteSaveRequest = {
      note: {
        meta: {
          title: activeNote.title,
          custom: Object.fromEntries(activeNote.keyValues),
          position: {
            x: activeNote.position.x + 20,
            y: activeNote.position.y + 20,
          },
          flags: [...activeNote.flags, `DUPLICATE_OF(${activeNote.id})`],
          contentType: activeNote.contentType,
        },
        content: activeNote.content,
      },
      changes: activeNote.linkedNotes.map((linkedNote) => {
        return {
          type: UserNoteChangeType.LINKED_NOTE_ADDED,
          noteId: linkedNote.id,
        };
      }),
      ignoreDuplicateTitles: true,
    };
    const noteFromServer = await databaseProvider.putNote(noteSaveRequest);
    refreshContentViews();
    goToNote(noteFromServer.meta.id);
  };

  useEffect(() => {
    checkAuthentication();
  }, []);


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


  const setNoteContent = (newContent: string): void => {
    setActiveNote((previousState) => {
      return {
        ...previousState,
        content: newContent,
      };
    });
    setUnsavedChanges(true);
  };


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


  return <DialogServiceProvider databaseProvider={databaseProvider}>
    <Routes>
      {/*
        this route is just to get rid of a react-router warning
        startApp() will take care of navigating to the correct start route
      */}
      <Route
        path="/"
        element={
          <></>
        }
      />
      <Route
        path={getAppPath(PathTemplate.LOGIN)}
        element={
          <LoginView
            setDatabaseMode={setDatabaseMode}
            serverDatabaseProvider={serverDatabaseProvider}
            localDatabaseProvider={localDatabaseProvider}
            toggleAppMenu={toggleAppMenu}
          />
        }
      />
      <Route
        path={getAppPath(PathTemplate.EDITOR)}
        element={
          <Navigate to={
            getAppPath(PathTemplate.EDITOR_WITH_NEW_NOTE)
          } replace />
        }
      />
      <Route
        path={
          getAppPath(
            PathTemplate.EDITOR_WITH_NOTE,
            new Map([["NOTE_ID", ":activeNoteId"]]),
          )
        }
        element={
          databaseProvider
            ? <NoteView
              databaseProvider={databaseProvider}
              unsavedChanges={unsavedChanges}
              setUnsavedChanges={setUnsavedChanges}
              toggleAppMenu={toggleAppMenu}
              refreshContentViews={refreshContentViews}
              headerStats={headerStats}
              pinnedNotes={pinnedNotes}
              handleSearchInputChange={handleSearchInputChange}
              setPinnedNotes={setPinnedNotes}
              searchValue={searchValue}
              sortMode={sortMode}
              handleSortModeChange={handleSortModeChange}
              noteListItems={noteListItems}
              numberOfResults={numberOfResults}
              noteListIsBusy={noteListIsBusy}
              noteListScrollTop={noteListScrollTop}
              setNoteListScrollTop={setNoteListScrollTop}
              page={page}
              setPage={setPage}
              setSearchValue={setSearchValue}
              activeNote={activeNote}
              setActiveNote={setActiveNote}
              saveActiveNote={saveActiveNote}
              createNewNote={createNewNote}
              createNewLinkedNote={createNewLinkedNote}
              removeActiveNote={removeActiveNote}
              duplicateNote={duplicateNote}
              contentMode={contentMode}
              setNoteContent={setNoteContent}
              toggleEditMode={toggleEditMode}
              importNote={importNote}
            />
            : null
        }
      />
      <Route
        path={getAppPath(PathTemplate.LIST)}
        element={
          databaseProvider
            ? <>
              <ListView
                toggleAppMenu={toggleAppMenu}
                refreshContentViews={refreshContentViews}
                stats={headerStats}
                pinnedNotes={pinnedNotes}
                handleSearchInputChange={handleSearchInputChange}
                searchValue={searchValue}
                sortMode={sortMode}
                handleSortModeChange={handleSortModeChange}
                noteListItems={noteListItems}
                numberOfResults={numberOfResults}
                noteListIsBusy={noteListIsBusy}
                noteListScrollTop={noteListScrollTop}
                setNoteListScrollTop={setNoteListScrollTop}
                page={page}
                setPage={setPage}
                setSearchValue={setSearchValue}
                unsavedChanges={unsavedChanges}
                setUnsavedChanges={setUnsavedChanges}
              />
              <FloatingActionButton
                title={l("editor.new-note")}
                icon="add"
                onClick={() => createNewNote()}
              ></FloatingActionButton>
            </>
            : null
        }
      />
      <Route
        path={getAppPath(PathTemplate.GRAPH)}
        element={
          <GraphView
            unsavedChanges={unsavedChanges}
            setUnsavedChanges={setUnsavedChanges}
            databaseProvider={databaseProvider}
            toggleAppMenu={toggleAppMenu}
            handleInvalidCredentialsError={handleInvalidCredentialsError}
          />
        }
      />
      <Route
        path={getAppPath(PathTemplate.FILES)}
        element={
          databaseProvider
            ? <FilesView
              databaseProvider={databaseProvider}
              toggleAppMenu={toggleAppMenu}
            />
            : null
        }
      />
      <Route
        path={getAppPath(
          PathTemplate.FILE,
          new Map([["FILE_ID", ":fileId"]]),
        )}
        element={
          databaseProvider
            ? <FileView
              databaseProvider={databaseProvider}
              toggleAppMenu={toggleAppMenu}
              createNewNote={createNewNote}
            />
            : null
        }
      />
      <Route
        path={getAppPath(PathTemplate.STATS)}
        element={
          databaseProvider
            ? <StatsView
              databaseProvider={databaseProvider}
              toggleAppMenu={toggleAppMenu}
            />
            : null
        }
      />
    </Routes>
    {
      isAppMenuOpen
        ? <AppMenu
          onClose={() => setIsAppMenuOpen(false)}
          unsavedChanges={unsavedChanges}
          setUnsavedChanges={setUnsavedChanges}
          databaseProvider={databaseProvider}
          createOneNotePerLine={createOneNotePerLine}
          switchGraphs={switchGraphs}
          createNewNote={createNewNote}
        />
        : null
    }
  </DialogServiceProvider>;
};

const App = (props) => {
  return <ConfirmationServiceProvider>
    <AppWithConfirmationServiceProvider {...props} />
  </ConfirmationServiceProvider>;
};

export default App;
