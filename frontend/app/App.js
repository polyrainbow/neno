import React, { useEffect, useState } from "react";
import EditorView from "./EditorView.js";
import GraphView from "./GraphView.js";
import LoginView from "./LoginView.js";
import BusyView from "./BusyView.js";
import databaseProvider from "./lib/database.js";
import ConfirmationServiceProvider from "./ConfirmationServiceProvider.js";


const App = () => {
  const [activeView, setActiveView] = useState("BUSY");
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [initialNoteId, setInitialNoteId] = useState(null);

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
    />;
  }

  if (activeView === "BUSY") {
    content = <BusyView />;
  }

  if (activeView === "LOGIN") {
    content = <LoginView
      setActiveView={(view) => {
        setUnsavedChanges(false);
        setActiveView(view);
      }}
      databaseProvider={databaseProvider}
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
    />;
  }

  return <ConfirmationServiceProvider>
    {content}
  </ConfirmationServiceProvider>;
};

export default App;
