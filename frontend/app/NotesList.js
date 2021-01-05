import React, { useEffect, useRef } from "react";
import NotesListStatus from "./NotesListStatus.js";
import NoteListItem from "./NoteListItem.js";
import Pagination from "./Pagination.js";
import NoteSearchDisclaimer from "./NoteSearchDisclaimer.js";


const NotesList = ({
  notes,
  numberOfResults,
  loadNote,
  activeNote,
  onLinkAddition,
  onLinkRemoval,
  displayedLinkedNotes,
  isBusy,
  searchValue,
  scrollTop,
  setScrollTop,
  sortMode,
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

  // set scrollTop when notes, status or sortMode have changed
  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    container.scrollTop = scrollTop;
  }, [notes, status, sortMode]);

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

  return <section ref={containerRef} id="section_list">
    <Pagination
      numberOfResults={numberOfResults}
      page={page}
      searchResultsPerPage={searchResultsPerPage}
      onChange={(newPage) => setPage(newPage)}
    />
    <NoteSearchDisclaimer
      searchValue={searchValue}
      numberOfResults={numberOfResults}
      stats={stats}
    />
    <div id="note-list">
      {
        notes.map((note) => {
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
            isActive={isActive}
            isLinked={isLinked}
            key={"main-notes-list-item-" + note.id}
            onSelect={() => loadNote(note.id)}
            onLinkChange={() => {
              if (isActive) return;

              if (!isLinked) {
                onLinkAddition(note);
              } else {
                onLinkRemoval(note.id);
              }
            }}
          />;
        })
      }
    </div>
    {
      notes.length >= 20
        ? <Pagination
          numberOfResults={numberOfResults}
          page={page}
          searchResultsPerPage={searchResultsPerPage}
          onChange={(newPage) => setPage(newPage)}
        />
        : ""
    }
  </section>;
};

export default NotesList;
