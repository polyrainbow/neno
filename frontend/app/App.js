import React, { useEffect, useState, useRef } from "react";
import EditorView from "./EditorView.js";
import GraphView from "./GraphView.js";
import LoginView from "./LoginView.js";
import BusyView from "./BusyView.js";
import ConfirmationServiceProvider from "./ConfirmationServiceProvider.js";
import AppMenu from "./AppMenu.js";
import ExportDatabaseDialog from "./ExportDatabaseDialog.js";
import StatsDialog from "./StatsDialog.js";
import LocalDatabaseProvider from "./lib/LocalDatabaseProvider.js";
import { API_URL, MAX_SESSION_AGE } from "./lib/config.js";


const App = () => {
  const [activeView, setActiveView] = useState("BUSY");
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [initialNoteId, setInitialNoteId] = useState(null);
  const [isAppMenuOpen, setIsAppMenuOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(null);
  const [databaseMode, setDatabaseMode] = useState("NONE");


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

  const serverDatabaseProviderRef = useRef(null);
  const serverDatabaseProvider = serverDatabaseProviderRef.current;
  const localDatabaseProviderRef = useRef(null);
  const localDatabaseProvider = localDatabaseProviderRef.current;

  const databaseProvider = databaseMode === "LOCAL"
    ? localDatabaseProvider
    : (
      databaseMode === "SERVER"
        ? serverDatabaseProvider
        : null
    );

  useEffect(async () => {
    // ENABLE_SERVER_DATABASE defined via webpack.DefinePlugin
    // eslint-disable-next-line no-undef
    if (ENABLE_SERVER_DATABASE) {
      const ServerDatabaseProvider = (await import(
        "./lib/ServerDatabaseProvider/index.js"
      )).default;

      serverDatabaseProviderRef.current = new ServerDatabaseProvider(
        API_URL,
        MAX_SESSION_AGE,
      );

      if (await serverDatabaseProviderRef.current.hasAccessToken()) {
        setDatabaseMode("SERVER");
        setActiveView("EDITOR");
        return;
      }
    } else {
      serverDatabaseProviderRef.current = "NOT_SUPPORTED";
    }

    localDatabaseProviderRef.current = new LocalDatabaseProvider();
    setActiveView("LOGIN");
  }, []);

  let content;

  if (activeView === "EDITOR") {
    content = <EditorView
      databaseProvider={databaseProvider}
      setActiveView={(view) => {
        setUnsavedChanges(false);
        setActiveView(view);
      }}
      unsavedChanges={unsavedChanges}
      setUnsavedChanges={setUnsavedChanges}
      initialNoteId={initialNoteId}
      toggleAppMenu={toggleAppMenu}
      setOpenDialog={setOpenDialog}
      openDialog={openDialog}
      setDatabaseMode={setDatabaseMode}
    />;
  }

  if (activeView === "BUSY") {
    content = <BusyView
      toggleAppMenu={toggleAppMenu}
    />;
  }

  if (activeView === "LOGIN") {
    content = <LoginView
      setActiveView={(view) => {
        setUnsavedChanges(false);
        setActiveView(view);
      }}
      setDatabaseMode={setDatabaseMode}
      serverDatabaseProvider={serverDatabaseProvider}
      localDatabaseProvider={localDatabaseProvider}
      toggleAppMenu={toggleAppMenu}
    />;
  }

  if (activeView === "GRAPH") {
    content = <GraphView
      setActiveView={(view) => {
        setUnsavedChanges(false);
        setActiveView(view);
      }}
      unsavedChanges={unsavedChanges}
      setUnsavedChanges={setUnsavedChanges}
      setInitialNoteId={setInitialNoteId}
      databaseProvider={databaseProvider}
      toggleAppMenu={toggleAppMenu}
    />;
  }


  return <ConfirmationServiceProvider>
    {content}
    {
      isAppMenuOpen
        ? <AppMenu
          setActiveView={setActiveView}
          activeView={activeView}
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
