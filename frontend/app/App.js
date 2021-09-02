import React, { useEffect, useState } from "react";
import EditorView from "./EditorView.js";
import ListView from "./ListView.js";
import GraphView from "./GraphView.js";
import LoginView from "./LoginView.js";
import ConfirmationServiceProvider from "./ConfirmationServiceProvider.js";
import AppMenu from "./AppMenu.js";
import ExportDatabaseDialog from "./ExportDatabaseDialog.js";
import StatsDialog from "./StatsDialog.js";
import { paths } from "./lib/config.js";
import {
  Route,
  useHistory,
} from "react-router-dom";
import useIsSmallScreen from "./hooks/useIsSmallScreen.js";
import FloatingActionButton from "./FloatingActionButton.js";
import DatabaseModes from "./enum/DatabaseModes.js";


const App = ({
  localDatabaseProvider,
  serverDatabaseProvider,
}) => {
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [isAppMenuOpen, setIsAppMenuOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(null);
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

  useEffect(async () => {
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
        toggleAppMenu={toggleAppMenu}
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
              toggleAppMenu={toggleAppMenu}
              setOpenDialog={setOpenDialog}
              openDialog={openDialog}
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
          openExportDatabaseDialog={() => setOpenDialog("EXPORT_DATABASE")}
          onClose={() => setIsAppMenuOpen(false)}
          unsavedChanges={unsavedChanges}
          setUnsavedChanges={setUnsavedChanges}
          showStats={() => setOpenDialog("STATS")}
          databaseProvider={databaseProvider}
        />
        : ""
    }
    {
      openDialog === "EXPORT_DATABASE"
        ? <ExportDatabaseDialog
          onCancel={() => setOpenDialog(null)}
          databaseProvider={databaseProvider}
        />
        : null
    }
    {
      openDialog === "STATS"
        ? <StatsDialog
          onCancel={() => setOpenDialog(null)}
          databaseProvider={databaseProvider}
        />
        : null
    }
  </ConfirmationServiceProvider>;
};

export default App;
