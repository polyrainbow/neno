import React from "react";
import NoteListItem from "./NoteListItem.js";


const NotesList = ({
  notes,
  loadNote,
  activeNote,
  onLinkAddition,
  displayedLinkedNotes,
  isBusy,
}) => {
  if (isBusy) {
    return <div
      style={{
        fontFamily: "sans-serif",
        fontSize: "20px",
        textAlign: "center",
        margin: "30px auto",
      }}
    >
      <img
        style={{
          width: "100px",
        }}
        src="/assets/icons/pending-24px.svg"
        alt="Loading notes"
      />
      <p>Loading notes ...</p>
    </div>;
  }

  if (!Array.isArray(notes)) {
    return "";
  }

  return <section id="list">
    <table id="list-table">
      <tbody>
        {
          notes.map((note, i) => {
            const isActive
              = (!activeNote.isUnsaved) && (note.id === activeNote.id);
            const isLinked
              = (!activeNote.isUnsaved) && displayedLinkedNotes.some(
                (linkedNote) => {
                  return linkedNote.id === note.id;
                },
              );

            return <NoteListItem
              note={note}
              index={i + 1}
              showLinksIndicator={true}
              isActive={isActive}
              isLinked={isLinked}
              key={"notes-list-item-" + note.id}
              onClick={() => loadNote(note.id)}
              onAdd={
                (!isActive) && (!isLinked)
                  ? () => {
                    onLinkAddition(note);
                  }
                  : null
              }
            />;
          })
        }
      </tbody>
    </table>
  </section>;
};

export default NotesList;
