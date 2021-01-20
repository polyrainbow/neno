import React, { useEffect, useState } from "react";
import EditorView from "./EditorView.js";
import GraphView from "./GraphView.js";
import LoginView from "./LoginView.js";
import BusyView from "./BusyView.js";
import databaseProvider from "./lib/database.js";
import ConfirmationServiceProvider from "./ConfirmationServiceProvider.js";
import AppMenu from "./AppMenu.js";
import ImportLinksDialog from "./ImportLinksDialog.js";
import ExportDatabaseDialog from "./ExportDatabaseDialog.js";


const App = () => {
  const [activeView, setActiveView] = useState("BUSY");
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [initialNoteId, setInitialNoteId] = useState(null);
  const [isAppMenuOpen, setIsAppMenuOpen] = useState(false);
  const [openDialog, setOpenDialog] = useState(null);

  const toggleAppMenu = () => {
    setIsAppMenuOpen(!isAppMenuOpen);
  };


  useEffect(() => {
    if (databaseProvider.isAuthorized()) {
      setActiveView("EDITOR");
    } else {
      setActiveView("LOGIN");
    }
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
      databaseProvider={databaseProvider}
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

  const importLinksAsNotes = async (links) => {
    await databaseProvider.importLinksAsNotes(links);
    setOpenDialog(null);
    refreshNotesList();
  };

  return <ConfirmationServiceProvider>
    {content}
    {
      isAppMenuOpen
        ? <AppMenu
          setActiveView={setActiveView}
          openExportDatabaseDialog={() => setOpenDialog("EXPORT_DATABASE")}
          onClose={() => setIsAppMenuOpen(false)}
        />
        : ""
    }
    {
      openDialog === "IMPORT_LINKS"
        ? <ImportLinksDialog
          importLinksAsNotes={importLinksAsNotes}
          onCancel={() => setOpenDialog(null)}
        />
        : null
    }
    {
      openDialog === "EXPORT_DATABASE"
        ? <ExportDatabaseDialog
          onCancel={() => setOpenDialog(null)}
          databaseProvider={databaseProvider}
        />
        : null
    }
  </ConfirmationServiceProvider>;
};

export default App;
