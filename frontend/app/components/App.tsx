import React, { useEffect, useState, useRef, useCallback } from "react";
import EditorView from "./EditorView";
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
} from "react-router-dom";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import FloatingActionButton from "./FloatingActionButton";
import { DatabaseMode } from "../enum/DatabaseMode.js";
import StatsView from "./StatsView";
import NoteListItemType from "../../../lib/notes/interfaces/NoteListItem";
import * as Config from "../lib/config";
import FilesView from "./FilesView";
import FileView from "./FileView";
import { getAppPath } from "../lib/utils";
import { PathTemplate } from "../enum/PathTemplate";
import DialogServiceProvider from "./DialogServiceProvider";


const App = ({
  localDatabaseProvider,
  serverDatabaseProvider,
}) => {
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
  const [isAppMenuOpen, setIsAppMenuOpen] = useState<boolean>(false);
  const [databaseMode, setDatabaseMode]
    = useState<DatabaseMode>(DatabaseMode.NONE);

  /* states for note list */
  const currentRequestId = useRef<string>("");
  const [noteListItems, setNoteListItems] = useState<NoteListItemType[]>([]);
  const [numberOfResults, setNumberOfResults] = useState<number>(NaN);
  const [noteListScrollTop, setNoteListScrollTop] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [noteListIsBusy, setNoteListIsBusy] = useState<boolean>(true);
  const [stats, setStats] = useState(null);
  const [sortMode, setSortMode] = useState("UPDATE_DATE_DESCENDING");
  const [searchValue, setSearchValue] = useState<string>("");
  const [pinnedNotes, setPinnedNotes] = useState<any[]>([]);

  const databaseProvider = databaseMode === DatabaseMode.LOCAL
    ? localDatabaseProvider
    : (
      databaseMode === DatabaseMode.SERVER
        ? serverDatabaseProvider
        : null
    );

  const navigate = useNavigate();
  const isSmallScreen = useIsSmallScreen();

  const handleSearchInputChange = (value) => {
    setSearchValue(value);
    setNoteListScrollTop(0);
    setPage(1);
  };


  const refreshStats = () => {
    if (!databaseProvider) return;

    databaseProvider.getStats({
      includeMetadata: false,
      includeAnalysis: false,
    })
      .then((stats) => {
        setStats(stats);
      })
      .catch((e) => {
        // if credentials are invalid, it's fine, refeshNotesList takes care of
        // this. if there is another error, throw.
        if (e.message !== "INVALID_CREDENTIALS") {
          throw new Error(e);
        }
      });
  };


  const handleInvalidCredentialsError = async () => {
    await databaseProvider.removeAccess();
    setDatabaseMode(DatabaseMode.NONE);
    navigate(getAppPath(PathTemplate.LOGIN));
  };


  const refreshNotesList = useCallback(
    async () => {
      if (!databaseProvider) return;

      refreshStats();
      setNoteListItems([]);

      // if searchValue is given but below MINIMUM_SEARCH_QUERY_LENGTH,
      // we don't do anything and leave the note list empty
      if (
        searchValue.length > 0
        && searchValue.length < Config.MINIMUM_SEARCH_QUERY_LENGTH
      ) {
        return;
      }

      setNoteListIsBusy(true);

      const options = {
        page,
        sortMode,
        searchString: "",
        caseSensitive: false,
      };

      if (searchValue.length >= Config.MINIMUM_SEARCH_QUERY_LENGTH) {
        options.searchString = searchValue;
      }

      const requestId = crypto.randomUUID();
      currentRequestId.current = requestId;
      try {
        const {
          results,
          numberOfResults,
        } = await databaseProvider.getNotes(options);

        // ... some time later - check if this is the current request
        if (currentRequestId.current === requestId) {
          setNoteListItems(results);
          setNumberOfResults(numberOfResults);
          setNoteListIsBusy(false);
        }

        const pinnedNotes = await databaseProvider.getPins();
        setPinnedNotes(pinnedNotes);
      } catch (e) {
        // if credentials are invalid, go to LoginView. If not, throw.
        if (e.message === "INVALID_CREDENTIALS") {
          await handleInvalidCredentialsError();
        } else {
          throw new Error(e);
        }
      }
    },
    [searchValue, page, sortMode, databaseProvider],
  );


  const handleSortModeChange = (sortMode) => {
    setNoteListScrollTop(0);
    setSortMode(sortMode);
    setPage(1);
  };


  useEffect(() => {
    refreshNotesList();
  }, [searchValue, page, sortMode, databaseProvider]);


  const beforeUnload = function(e) {
    if (unsavedChanges) {
      // Cancel the event
      e.preventDefault();
      // If you prevent default behavior in Mozilla Firefox prompt will
      // always be shown
      // Chrome requires returnValue to be set
      e.returnValue = "";
    } else {
      // the absence of a returnValue property on the event will guarantee
      // the browser unload happens
      delete e.returnValue;
    }
  };


  useEffect(() => {
    window.addEventListener("beforeunload", beforeUnload);

    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
    };
  }, [beforeUnload]);


  const toggleAppMenu = () => {
    setIsAppMenuOpen(!isAppMenuOpen);
  };


  const importLinksAsNotes = async (links) => {
    await databaseProvider.importLinksAsNotes(links);
    refreshNotesList();
  };


  const switchGraphs = (graphId) => {
    databaseProvider.setGraphId(graphId);
    navigate(
      isSmallScreen
        ? getAppPath(PathTemplate.LIST)
        : getAppPath(PathTemplate.EDITOR_WITH_NEW_NOTE),
    );
    refreshNotesList();
  };


  const startApp = async () => {
    if (await serverDatabaseProvider?.isAuthenticated()) {
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

  useEffect(() => {
    startApp();
  }, []);


  return <ConfirmationServiceProvider>
    <DialogServiceProvider databaseProvider={databaseProvider}>
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
              ? <EditorView
                databaseProvider={databaseProvider}
                unsavedChanges={unsavedChanges}
                setUnsavedChanges={setUnsavedChanges}
                toggleAppMenu={toggleAppMenu}
                handleInvalidCredentialsError={handleInvalidCredentialsError}
                refreshNotesList={refreshNotesList}
                stats={stats}
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
                  refreshNotesList={refreshNotesList}
                  stats={stats}
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
                  title="New note"
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
            <FilesView
              databaseProvider={databaseProvider}
              toggleAppMenu={toggleAppMenu}
            />
          }
        />
        <Route
          path={getAppPath(
            PathTemplate.FILE,
            new Map([["FILE_ID", ":fileId"]]),
          )}
          element={
            <FileView
              databaseProvider={databaseProvider}
              toggleAppMenu={toggleAppMenu}
            />
          }
        />
        <Route
          path={getAppPath(PathTemplate.STATS)}
          element={
            <StatsView
              databaseProvider={databaseProvider}
              toggleAppMenu={toggleAppMenu}
            />
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
            importLinksAsNotes={importLinksAsNotes}
            switchGraphs={switchGraphs}
          />
          : null
      }
    </DialogServiceProvider>
  </ConfirmationServiceProvider>;
};

export default App;
