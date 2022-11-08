import React, { useEffect, useState } from "react";
import ExistingNote from "../../lib/notes/interfaces/ExistingNote";
import { NoteSaveRequest } from "../../lib/notes/interfaces/NoteSaveRequest";
import {
  getNoteContent,
  putNote,
} from "../utils";
import ExistingNotes from "./ExistingNotes";

const forbiddenUrlStartStrings = [
  "chrome://",
  "about:",
  "chrome-extension://",
];

interface EditorProps {
  apiKey: string,
  hostUrl: string,
  activeTab: chrome.tabs.Tab,
  graphId: string,
}

const Editor = ({ apiKey, hostUrl, activeTab, graphId }: EditorProps) => {
  const [statusMessage, setStatusMessage] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [noteText, setNoteText] = useState("");
  const [activeNote, setActiveNote] = useState<ExistingNote | null>(null);
  const [pushNoteButtonValue, setPushNoteButtonValue] = useState("Add");

  useEffect(() => {
    activeTab?.title && setNoteTitle(activeTab.title);
  }, [activeTab]);

  if (activeTab && forbiddenUrlStartStrings.some(
    (startString) => activeTab.url?.startsWith(startString),
  )) {
    return <main><p>This page cannot be added as a note.</p></main>;
  }

  const pushNote = async () => {
    if (
      (typeof graphId !== "string")
      || (typeof activeTab.url !== "string")
      || (typeof activeTab.title !== "string")
    ) {
      throw new Error("pushNote: Missing properties!");
    }

    const content = getNoteContent({
      url: activeTab.url,
      pageTitle: activeTab.title,
      noteText,
    });

    const noteSaveRequest: NoteSaveRequest = {
      note: {
        meta: activeNote
          ? {
            // eslint-disable-next-line no-undefined
            ...activeNote.meta,
            title: noteTitle,
          }
          : {
            title: noteTitle,
            custom: {},
            contentType: "text/subway",
            flags: ["CREATED_WITH_BROWSER_EXTENSION"],
          },
        content,
      },
      ignoreDuplicateTitles: true,
    };

    const result = await putNote({
      noteSaveRequest,
      hostUrl,
      apiKey,
      graphId,
    });

    if (result.success) {
      setStatusMessage("Note added. ");
      setActiveNote(result.payload);
      setPushNoteButtonValue("Update");
    } else {
      setStatusMessage("Error adding note: " + result.error);
    }
  };

  const link = activeNote
    ? <a
      href={`${hostUrl}/graph/${graphId}/note/${activeNote.meta.id}`}
      target="_blank"
      rel="noreferrer"
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
    {
      graphId
        ? <div id="div_controls">
          <button
            id="button_pushNote"
            onClick={pushNote}
          >{pushNoteButtonValue}</button>
        </div>
        : ""
    }
    <div>
      <p id="note-status">{statusMessage} {link}</p>
    </div>
    <ExistingNotes
      apiKey={apiKey}
      hostUrl={hostUrl}
      activeTab={activeTab}
      graphId={graphId}
    />
  </main>;
};

export default Editor;
