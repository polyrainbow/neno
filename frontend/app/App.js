import React, { useEffect, useState } from "react";
import EditorView from "./EditorView.js";
import GraphView from "./GraphView.js";
import LoginView from "./LoginView.js";
import BusyView from "./BusyView.js";
import databaseProvider from "./lib/database.js";

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

  if (activeView === "EDITOR") {
    return <EditorView
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
    return <BusyView />;
  }

  if (activeView === "LOGIN") {
    return <LoginView
      setActiveView={(view) => {
        setUnsavedChanges(false);
        setActiveView(view);
      }}
      databaseProvider={databaseProvider}
    />;
  }

  if (activeView === "GRAPH") {
    return <GraphView
      setActiveView={(view) => {
        setUnsavedChanges(false);
        setActiveView(view);
      }}
      unsavedChanges={unsavedChanges}
      setUnsavedChanges={setUnsavedChanges}
      setInitialNoteId={setInitialNoteId}
    />;
  }
};

export default App;
