import React, { useEffect, useState } from "react";
import {
  getNoteBlocks,
  putNote,
} from "../utils";
import ExistingNotes from "./ExistingNotes";

const forbiddenUrlStartStrings = [
  "chrome://",
  "about:",
  "chrome-extension://",
];

export default ({config, activeTab, graphId}) => {
  const [statusMessage, setStatusMessage] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteText, setNoteText] = useState("");
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [pushNoteButtonValue, setPushNoteButtonValue] = useState("Add");

  useEffect(() => {
    activeTab?.title && setNoteTitle(activeTab.title)
  }, [activeTab]);

  if (activeTab && forbiddenUrlStartStrings.some(
    (startString) => activeTab.url.startsWith(startString),
  )) {
    return <main><p>This page cannot be added as a note.</p></main>;
  }

  const pushNote = async () => {
    if (typeof graphId !== "string") return;
  
    const blocks = getNoteBlocks({
      url: activeTab.url,
      pageTitle: activeTab.title,
      noteText,
    });

    const result = await putNote({
      note: {
        id: activeNoteId,
        blocks,
        title: noteTitle,
      },
      hostUrl: config.hostUrl,
      apiKey: config.apiKey,
      graphId,
    });

    if (result.success) {
      setStatusMessage("Note added. ");
      setActiveNoteId(result.payload.id);
      setPushNoteButtonValue("Update");
    } else {
      setStatusMessage("Error adding note: " + result.error);
    }
  };

  const link = typeof activeNoteId === "number"
    ? <a
      href={config.hostUrl + "/editor/" + activeNoteId}
      target="_blank"
    >Click here to open it in NENO.</a>
    : "";


  return <main id="section_main">
    <h2>Add this page as a note</h2>
    <input
      type="text"
      id="input_note-title"
      value={noteTitle}
      onInput={(e) => setNoteTitle((e.target as HTMLInputElement).value)}
    />
    <textarea
      id="textarea_note-text"
      onInput={(e) => setNoteText((e.target as HTMLTextAreaElement).value)}
      value={noteText}
    />
    <div id="div_controls">
      <button
        id="button_pushNote"
        onClick={pushNote}
      >{pushNoteButtonValue}</button>
    </div>
    <div>
      <p id="note-status">{statusMessage} {link}</p>
    </div>
    <ExistingNotes
      config={config}
      activeTab={activeTab}
      graphId={graphId}
    />
  </main>;
}
