import React, { useEffect } from "react";
import NoteListItem from "./NoteListItem.js";
import * as Editor from "./lib/editor.js";
import NoteStats from "./NoteStats.js";

const Note = ({
  note,
  loadNote,
  displayedLinkedNotes,
  onLinkRemoval,
}) => {
  useEffect(() => {
    const data = note?.editorData;
    const parent = document.getElementById("editor");
    if (!parent) return;
    Editor.load(data, parent);
  }, [note]);


  return <section id="note">
    <div id="editor"></div>
    <div id="links">
      <h2>Links</h2>
      <table id="links-table">
        <tbody>
          {
            displayedLinkedNotes.map((displayedLinkedNote, i) => <NoteListItem
              note={displayedLinkedNote}
              index={i + 1}
              showLinksIndicator={false}
              key={"note-link-list-item-" + displayedLinkedNote.id}
              onClick={() => loadNote(displayedLinkedNote.id)}
              isActive={false}
              onDelete={() => onLinkRemoval(displayedLinkedNote.id)}
            />)
          }
        </tbody>
      </table>
    </div>
    {
      (!note.isUnsaved)
        ? <NoteStats note={note} />
        : ""
    }
  </section>;
};

export default Note;
