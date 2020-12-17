import React, { useEffect, useState } from "react";
import EditorView from "./EditorView.js";
import GraphView from "./GraphView.js";
import LoginView from "./LoginView.js";
import BusyView from "./BusyView.js";
import * as tokenManager from "./lib/tokenManager.js"; 

const App = () => {
  const [activeView, setActiveView] = useState("BUSY");
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [initialNoteId, setInitialNoteId] = useState(null);

  useEffect(() => {
    if (tokenManager.get()) {
      setActiveView("EDITOR");
    } else {
      setActiveView("LOGIN");
    }
  }, []);

  if (activeView === "EDITOR") {
    return <EditorView
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
