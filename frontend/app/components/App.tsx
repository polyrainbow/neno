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
import NoteFromUser from "../../../lib/notes/interfaces/NoteFromUser";
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
import NotePutOptions from "../../../lib/notes/interfaces/NotePutOptions";
import {
  UserNoteChangeType,
} from "../../../lib/notes/interfaces/UserNoteChangeType";

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


  const loadNote = async (noteId: NoteId): Promise<void> => {
    if (!databaseProvider) {
      throw new Error("loadNote: No database provider loaded");
    }

    try {
      const noteFromServer = await databaseProvider.getNote(noteId);
      if (noteFromServer) {
        setActiveNote({
          ...noteFromServer,
          isUnsaved: false,
          changes: [],
          content: noteFromServer.content,
          files: noteFromServer.files,
        });
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
          .then((pinnedNotes) => setPinnedNotes(pinnedNotes));
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
      const note: NoteFromUser = {
        title: getNoteTitleFromContent(line),
        content: line,
      };
      return databaseProvider?.putNote(note, {
        ignoreDuplicateTitles: true,
      });
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
  ) => {
    if (unsavedChanges) {
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
      updateTime: activeNote.updateTime,
      title: activeNote.title,
    };

    createNewNote([linkedNote]);
  };


  const removeActiveNote = async () => {
    if (activeNote.isUnsaved) {
      return;
    }

    await databaseProvider?.deleteNote(activeNote.id);
    refreshContentViews();
    createNewNote();
  };


  const prepareNoteToTransmit = async (): Promise<NoteFromUser> => {
    const noteToTransmit: NoteFromUser = {
      title: activeNote.title,
      content: activeNote.content,
      changes: activeNote.changes.map(
        (change: FrontendUserNoteChange): UserNoteChange => {
          return {
            type: change.type,
            noteId: change.noteId,
          };
        }),
      // eslint-disable-next-line no-undefined
      id: (!activeNote.isUnsaved) ? activeNote.id : undefined,
    };

    Utils.setNoteTitleByContentIfUnset(
      noteToTransmit,
      Config.DEFAULT_NOTE_TITLE,
    );

    return noteToTransmit;
  };


  const saveActiveNote = async (options: NotePutOptions): Promise<void> => {
    if (!databaseProvider) {
      throw new Error("saveActiveNote: No database provider loaded");
    }
    const noteToTransmit = await prepareNoteToTransmit();
    const noteFromDatabase = await databaseProvider.putNote(
      noteToTransmit, options,
    );
    setActiveNote({
      isUnsaved: false,
      id: noteFromDatabase.id,
      title: noteFromDatabase.title,
      content: noteFromDatabase.content,
      creationTime: noteFromDatabase.creationTime,
      updateTime: noteFromDatabase.updateTime,
      linkedNotes: noteFromDatabase.linkedNotes,
      position: noteFromDatabase.position,
      numberOfCharacters: noteFromDatabase.numberOfCharacters,
      files: noteFromDatabase.files,
      changes: [],
    });
    setUnsavedChanges(false);
    refreshContentViews();
    /*
      when saving the new note for the first time, we get its id from the
      databaseProvider. then we update the address bar to include the new id
    */
    goToNote(noteFromDatabase.id, true);
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

    const noteToTransmit: NoteFromUser = {
      title: activeNote.title,
      content: activeNote.content,
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
    refreshContentViews();
    goToNote(noteFromServer.id);
  };

  useEffect(() => {
    checkAuthentication();
  }, []);


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
                onClick={() => navigate(
                  getAppPath(PathTemplate.EDITOR_WITH_NEW_NOTE),
                )}
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
              createNewNote={createNewNote}
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
