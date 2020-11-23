import React from "react";
import NoteListItem from "./NoteListItem.js";


const NotesList = ({
  notes,
  loadNote,
  activeNote,
  onLinkAddition,
  displayedLinkedNotes,
  status,
}) => {
  if (status === "BUSY" || status === "SEARCH_VALUE_TOO_SHORT") {
    return <div
      style={{
        fontSize: "20px",
        textAlign: "center",
        margin: "30px auto",
      }}
    >
      <img
        style={{
          width: "100px",
        }}
        src={
          status === "BUSY"
            ? "/assets/icons/pending-24px.svg"
            : "/assets/icons/looks_3-24px.svg"
        }
        alt={
          status === "BUSY"
            ? "Loading notes"
            : "Please type at least 3 characters to search"
        }
      />
      <p>{
        status === "BUSY"
          ? "Loading notes ..."
          : "Please type at least 3 characters to search"
      }</p>
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
