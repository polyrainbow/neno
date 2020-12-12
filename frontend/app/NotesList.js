import React, { useEffect, useRef } from "react";
import NotesListStatus from "./NotesListStatus.js";
import NoteListItem from "./NoteListItem.js";
import Pagination from "./Pagination.js";
import NoteSearchDisclaimer from "./NoteSearchDisclaimer.js";


const NotesList = ({
  notes,
  loadNote,
  activeNote,
  onLinkAddition,
  displayedLinkedNotes,
  isBusy,
  searchValue,
  scrollTop,
  setScrollTop,
  sortBy,
  page,
  setPage,
  stats,
}) => {
  const containerRef = useRef(null);

  const searchResultsPerPage = 100;

  let status = "DEFAULT";

  if (searchValue.length > 0 && searchValue.length < 3) {
    status = "SEARCH_VALUE_TOO_SHORT";
  }

  if (isBusy) {
    status = "BUSY";
  }

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

  // set scrollTop when notes, status or sortBy have changed
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

  const startNote = page * searchResultsPerPage - 100;
  const endNote = startNote + searchResultsPerPage - 1;
  const firstNoteExcluded = endNote + 1;

  return <section ref={containerRef} id="list">
    <Pagination
      numberOfResults={notes.length}
      page={page}
      searchResultsPerPage={searchResultsPerPage}
      onChange={(newPage) => setPage(newPage)}
    />
    <NoteSearchDisclaimer
      searchValue={searchValue}
      notes={notes}
      stats={stats}
    />
    <table id="list-table">
      <tbody>
        {
          notes.slice(startNote, firstNoteExcluded).map((note, i) => {
            const isActive
              = (!activeNote.isUnsaved) && (note.id === activeNote.id);
            const isLinked
              = displayedLinkedNotes.some(
                (linkedNote) => {
                  return linkedNote.id === note.id;
                },
              );

            return <NoteListItem
              note={note}
              index={startNote + 1 + i}
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
