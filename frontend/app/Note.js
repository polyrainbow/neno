import React, { useEffect, useRef } from "react";
import NoteListItem from "./NoteListItem.js";
import * as Editor from "./lib/editor.js";
import NoteStats from "./NoteStats.js";
import isEqual from "react-fast-compare";
import NoteControls from "./NoteControls.js";

const Note = ({
  note,
  loadNote,
  displayedLinkedNotes,
  onLinkRemoval,
  setUnsavedChanges,
  databaseProvider,
  createNewNote,
  saveNote,
  removeActiveNote,
  unsavedChanges,
}) => {
  const previousEditorData = useRef(null);
  const editorData = note?.editorData;

  useEffect(() => {
    const parent = document.getElementById("editor");
    if (!parent) return;

    if (isEqual(editorData?.blocks, previousEditorData.current?.blocks)) {
      return;
    }

    Editor.load({
      data: editorData,
      parent,
      onChange: () => setUnsavedChanges(true),
      databaseProvider,
    })
      .then(() => {
        previousEditorData.current = editorData;
      });

  // it is important that we only perform this effect when editorData changes,
  // because otherwise it is executed more often and editor loading takes some
  // time
  }, [editorData]);

  return <section id="note">
    <NoteControls
      activeNote={note}
      createNewNote={createNewNote}
      saveNote={saveNote}
      removeActiveNote={removeActiveNote}
      unsavedChanges={unsavedChanges}
    />
    <div id="editor"></div>
    <div id="links">
      <h2>Links</h2>
      {
        displayedLinkedNotes.length === 0
          ? <p className="note-meta-paragraph"
          >This note has no links yet.</p>
          : null
      }
      <div id="links">
        {
          displayedLinkedNotes.map((displayedLinkedNote) => <NoteListItem
            note={displayedLinkedNote}
            key={"note-link-list-item-" + displayedLinkedNote.id}
            onSelect={() => loadNote(displayedLinkedNote.id)}
            isActive={false}
            isLinked={true}
            onLinkChange={() => onLinkRemoval(displayedLinkedNote.id)}
          />)
        }
      </div>
    </div>
    {
      (!note.isUnsaved)
        ? <NoteStats note={note} />
        : ""
    }
  </section>;
};

export default Note;
