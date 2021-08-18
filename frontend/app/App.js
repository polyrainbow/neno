import React, { useEffect, useState } from "react";
import EditorView from "./EditorView.js";
import GraphView from "./GraphView.js";
import LoginView from "./LoginView.js";
import ConfirmationServiceProvider from "./ConfirmationServiceProvider.js";
import AppMenu from "./AppMenu.js";
import ExportDatabaseDialog from "./ExportDatabaseDialog.js";
import StatsDialog from "./StatsDialog.js";
import LocalDatabaseProvider from "./lib/LocalDatabaseProvider.js";
import { API_URL, MAX_SESSION_AGE } from "./lib/config.js";
import {
  Route,
  useHistory,
} from "react-router-dom";


const App = () => {
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [isAppMenuOpen, setIsAppMenuOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(null);
  const [databaseMode, setDatabaseMode] = useState("NONE");

  const history = useHistory();

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

  const [serverDatabaseProvider, setServerDatabaseProvider] = useState(null);
  const [localDatabaseProvider, setLocalDatabaseProvider] = useState(null);

  const databaseProvider = databaseMode === "LOCAL"
    ? localDatabaseProvider
    : (
      databaseMode === "SERVER"
        ? serverDatabaseProvider
        : null
    );

  useEffect(async () => {
    // LocalDatabaseProvider must be initialized before we check and go for the
    // server database so in case we log out from server, we have a
    // functioning LocalDatabaseProvider instance
    setLocalDatabaseProvider(new LocalDatabaseProvider());

    // ENABLE_SERVER_DATABASE defined via webpack.DefinePlugin
    // eslint-disable-next-line no-undef
    if (ENABLE_SERVER_DATABASE) {
      const ServerDatabaseProvider = (await import(
        "./lib/ServerDatabaseProvider/index.js"
      )).default;

      const serverDatabaseProvider = new ServerDatabaseProvider(
        API_URL,
        MAX_SESSION_AGE,
      );

      setServerDatabaseProvider(serverDatabaseProvider);
      if (await serverDatabaseProvider.hasAccessToken()) {
        setDatabaseMode("SERVER");
        if (location.pathname.startsWith("/login")) {
          history.push("/editor/new");
        }
        return;
      }
    }

    history.push("/login");
  }, []);


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
            setDatabaseMode={setDatabaseMode}
          />
          : ""
      }
    </Route>
    <Route path="/graph">
      <GraphView
        unsavedChanges={unsavedChanges}
        setUnsavedChanges={setUnsavedChanges}
        databaseProvider={databaseProvider}
        toggleAppMenu={toggleAppMenu}
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
