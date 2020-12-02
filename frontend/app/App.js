import React, { useState } from "react";
import EditorView from "./EditorView.js";
import GraphView from "./GraphView.js";

const App = () => {
  const [activeView, setActiveView] = useState("EDITOR");
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [initialNoteId, setInitialNoteId] = useState(null);

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
