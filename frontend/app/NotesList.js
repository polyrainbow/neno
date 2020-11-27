import React, { useEffect, useRef } from "react";
import NotesListStatus from "./NotesListStatus.js";
import NoteListItem from "./NoteListItem.js";


const NotesList = ({
  notes,
  loadNote,
  activeNote,
  onLinkAddition,
  displayedLinkedNotes,
  status,
  scrollTop,
  setScrollTop,
  sortBy,
}) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    const onScroll = () => {
      setScrollTop(container.scrollTop);
    };

    if (!container) {
      return;
    }

    container.addEventListener("scroll", onScroll);

    return () => {
      container.removeEventListener("scroll", onScroll);
    };
  }, [status]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    container.scrollTop = scrollTop;
  }, [notes, status, sortBy]);

  if (status === "BUSY" || status === "SEARCH_VALUE_TOO_SHORT") {
    return <NotesListStatus
      status={status}
    />;
  }

  if (!Array.isArray(notes) || (notes.length === 0)) {
    return <NotesListStatus
      status="NO_NOTES_FOUND"
    />;
  }

  return <section ref={containerRef} id="list">
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
