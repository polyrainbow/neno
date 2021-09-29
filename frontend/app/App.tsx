import React, { useEffect, useState } from "react";
import EditorView from "./EditorView";
import ListView from "./ListView";
import GraphView from "./GraphView";
import LoginView from "./LoginView";
import ConfirmationServiceProvider from "./ConfirmationServiceProvider";
import AppMenu from "./AppMenu";
import ExportDatabaseDialog from "./ExportDatabaseDialog";
import StatsDialog from "./StatsDialog";
import { paths } from "./lib/config";
import {
  Route,
  useHistory,
} from "react-router-dom";
import useIsSmallScreen from "./hooks/useIsSmallScreen";
import FloatingActionButton from "./FloatingActionButton";
import DatabaseModes from "./enum/DatabaseModes.js";
import { Dialog } from "./enum/Dialog";


const App = ({
  localDatabaseProvider,
  serverDatabaseProvider,
}) => {
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [isAppMenuOpen, setIsAppMenuOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState<Dialog | null>(null);
  const [databaseMode, setDatabaseMode] = useState(DatabaseModes.NONE);

  const history = useHistory();
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


  const databaseProvider = databaseMode === DatabaseModes.LOCAL
    ? localDatabaseProvider
    : (
      databaseMode === DatabaseModes.SERVER
        ? serverDatabaseProvider
        : null
    );

  const startApp = async () => {
    if (await serverDatabaseProvider?.isAuthenticated()) {
      setDatabaseMode(DatabaseModes.SERVER);
      if (
        location.pathname.startsWith(paths.login)
        || location.pathname === "/"
      ) {
        history.push(isSmallScreen ? paths.list : paths.newNote);
      }
    } else {
      history.push(paths.login);
    }
  }

  useEffect(() => {
    startApp();
  }, []);


  const handleInvalidCredentialsError = async () => {
    await databaseProvider.removeAccess();
    setDatabaseMode(DatabaseModes.NONE);
    history.push(paths.login);
  };


  return <ConfirmationServiceProvider>
    <Route path="/login">
      <LoginView
        setDatabaseMode={setDatabaseMode}
        serverDatabaseProvider={serverDatabaseProvider}
        localDatabaseProvider={localDatabaseProvider}
      />
    </Route>
    <Route path="/editor/:activeNoteId?">
      {
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
          : ""
      }
    </Route>
    <Route path={paths.list}>
      {
        databaseProvider
          ? <>
            <ListView
              databaseProvider={databaseProvider}
              unsavedChanges={unsavedChanges}
              setUnsavedChanges={setUnsavedChanges}
              toggleAppMenu={toggleAppMenu}
              handleInvalidCredentialsError={handleInvalidCredentialsError}
            />
            <FloatingActionButton
              title="New note"
              icon="note_add"
              onClick={() => history.push(paths.newNote)}
            ></FloatingActionButton>
          </>
          : ""
      }
    </Route>
    <Route path={paths.graph}>
      <GraphView
        unsavedChanges={unsavedChanges}
        setUnsavedChanges={setUnsavedChanges}
        databaseProvider={databaseProvider}
        toggleAppMenu={toggleAppMenu}
        handleInvalidCredentialsError={handleInvalidCredentialsError}
      />
    </Route>
    {
      isAppMenuOpen
        ? <AppMenu
          openExportDatabaseDialog={() => setOpenDialog(Dialog.EXPORT_DATABASE)}
          onClose={() => setIsAppMenuOpen(false)}
          unsavedChanges={unsavedChanges}
          setUnsavedChanges={setUnsavedChanges}
          showStats={() => setOpenDialog(Dialog.STATS)}
          databaseProvider={databaseProvider}
        />
        : ""
    }
    {
      openDialog === Dialog.EXPORT_DATABASE
        ? <ExportDatabaseDialog
          onCancel={() => setOpenDialog(null)}
          databaseProvider={databaseProvider}
        />
        : null
    }
    {
      openDialog === Dialog.STATS
        ? <StatsDialog
          onCancel={() => setOpenDialog(null)}
          databaseProvider={databaseProvider}
        />
        : null
    }
  </ConfirmationServiceProvider>;
};

export default App;
