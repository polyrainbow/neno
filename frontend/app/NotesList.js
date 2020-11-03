import React from "react";
import NoteListItem from "./NoteListItem.js";


const NotesList = ({
  notes,
  loadNote,
  activeNote,
}) => {
  if (!Array.isArray(notes)) {
    return "";
  }

  return <section id="list">
    <table id="list-table">
      <tbody>
        {
          notes.map((note, i) => {
            return <NoteListItem
              note={note}
              index={i + 1}
              showLinksIndicator={true}
              isActive={activeNote && (note.id === activeNote.id)}
              key={"notes-list-item-" + note.id}
              onClick={() => loadNote(note.id)}
            />;
          })
        }
      </tbody>
    </table>
  </section>;
};

export default NotesList;
