import React, { useEffect, useState } from "react";
import EditorView from "./EditorView";
import ListView from "./ListView";
import GraphView from "./GraphView";
import LoginView from "./LoginView";
import ConfirmationServiceProvider from "./ConfirmationServiceProvider";
import AppMenu from "./AppMenu";
import ExportDatabaseDialog from "./ExportDatabaseDialog";
import { paths } from "./lib/config";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import useIsSmallScreen from "./hooks/useIsSmallScreen";
import FloatingActionButton from "./FloatingActionButton";
import { DatabaseMode } from "./enum/DatabaseMode.js";
import { DialogType } from "./enum/DialogType";
import StatsView from "./StatsView";


const App = ({
  localDatabaseProvider,
  serverDatabaseProvider,
}) => {
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
  const [isAppMenuOpen, setIsAppMenuOpen] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<DialogType>(DialogType.NONE);
  const [databaseMode, setDatabaseMode]
    = useState<DatabaseMode>(DatabaseMode.NONE);

  const navigate = useNavigate();
  const isSmallScreen = useIsSmallScreen();

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


  const databaseProvider = databaseMode === DatabaseMode.LOCAL
    ? localDatabaseProvider
    : (
      databaseMode === DatabaseMode.SERVER
        ? serverDatabaseProvider
        : null
    );

  const startApp = async () => {
    if (await serverDatabaseProvider?.isAuthenticated()) {
      setDatabaseMode(DatabaseMode.SERVER);
      if (
        location.pathname.startsWith(paths.login)
        || location.pathname === "/"
      ) {
        navigate(isSmallScreen ? paths.list : paths.editorWithNewNote);
      }
    } else {
      navigate(paths.login);
    }
  };

  useEffect(() => {
    startApp();
  }, []);


  const handleInvalidCredentialsError = async () => {
    await databaseProvider.removeAccess();
    setDatabaseMode(DatabaseMode.NONE);
    navigate(paths.login);
  };


  return <ConfirmationServiceProvider>
    <Routes>
      <Route
        path={paths.login}
        element={
          <LoginView
            setDatabaseMode={setDatabaseMode}
            serverDatabaseProvider={serverDatabaseProvider}
            localDatabaseProvider={localDatabaseProvider}
          />
        }
      />
      <Route
        path={paths.editor}
        element={
          <Navigate to={paths.editorWithNewNote} replace />
        }
      />
      <Route
        path={paths.editor + "/:activeNoteId"}
        element={
          databaseProvider
            ? <EditorView
              databaseProvider={databaseProvider}
              unsavedChanges={unsavedChanges}
              setUnsavedChanges={setUnsavedChanges}
              toggleAppMenu={toggleAppMenu}
              setOpenDialog={setOpenDialog}
              openDialog={openDialog}
              handleInvalidCredentialsError={handleInvalidCredentialsError}
            />
            : null
        }
      />
      <Route
        path={paths.list}
        element={
          databaseProvider
            ? <>
              <ListView
                databaseProvider={databaseProvider}
                toggleAppMenu={toggleAppMenu}
                handleInvalidCredentialsError={handleInvalidCredentialsError}
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
              />
              <FloatingActionButton
                title="New note"
                icon="note_add"
                onClick={() => navigate(paths.editorWithNewNote)}
              ></FloatingActionButton>
            </>
            : null
        }
      />
      <Route
        path={paths.graph}
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
        path={paths.stats}
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
          openExportDatabaseDialog={
            () => setOpenDialog(DialogType.EXPORT_DATABASE)
          }
          onClose={() => setIsAppMenuOpen(false)}
          unsavedChanges={unsavedChanges}
          setUnsavedChanges={setUnsavedChanges}
          databaseProvider={databaseProvider}
        />
        : null
    }
    {
      openDialog === DialogType.EXPORT_DATABASE
        ? <ExportDatabaseDialog
          onCancel={() => setOpenDialog(DialogType.NONE)}
          databaseProvider={databaseProvider}
        />
        : null
    }
  </ConfirmationServiceProvider>;
};

export default App;
