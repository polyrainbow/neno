import { useEffect, useRef } from "react";
import NoteListStatusIndicator, {
  NoteListStatus,
} from "./NoteListStatusIndicator";
import NoteListItem from "./NoteListItem";
import Pagination from "./Pagination";
import NoteSearchDisclaimer from "./NoteSearchDisclaimer";
import { SEARCH_RESULTS_PER_PAGE } from "../config";
import ActiveNote from "../types/ActiveNote";
import {
  NoteListSortMode,
} from "../lib/notes/types/NoteListSortMode";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import NoteListItemType from "../lib/notes/types/NoteListItem";
import { Slug } from "../lib/notes/types/Slug";


interface NoteListProps {
  notes: NoteListItemType[],
  numberOfResults: number,
  activeNote: ActiveNote | null,
  isBusy: boolean,
  searchValue: string,
  scrollTop: number,
  setScrollTop: (scrollTop: number) => void,
  sortMode: NoteListSortMode,
  page: number,
  setPage: (newPage: number) => void,
  itemsAreLinkable: boolean,
  unsavedChanges: boolean,
  setUnsavedChanges: (unsavedChanges: boolean) => void,
  onLinkIndicatorClick: (slug: Slug, title: string) => void,
  selectedIndex: number,
  onSelect: (slug: Slug) => void,
}

const NoteList = ({
  notes,
  numberOfResults,
  activeNote,
  isBusy,
  searchValue,
  scrollTop,
  setScrollTop,
  sortMode,
  page,
  setPage,
  itemsAreLinkable,
  onLinkIndicatorClick,
  selectedIndex,
  onSelect,
}: NoteListProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isSmallScreen = useIsSmallScreen();

  let status = NoteListStatus.DEFAULT;

  if (isBusy) {
    status = NoteListStatus.BUSY;
  }

  useEffect(() => {
    const container = containerRef.current;

    const onScroll = () => {
      if (container) {
        setScrollTop(container.scrollTop);
      }
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

  if (status === NoteListStatus.BUSY) {
    return <NoteListStatusIndicator
      status={status}
    />;
  }

  if (!Array.isArray(notes) || (notes.length === 0)) {
    return <NoteListStatusIndicator
      status={NoteListStatus.NO_NOTES_FOUND}
    />;
  }

  return <section
    ref={containerRef}
    className="list-section"
  >
    {
      !isSmallScreen
        ? <Pagination
          numberOfResults={numberOfResults}
          page={page}
          searchResultsPerPage={SEARCH_RESULTS_PER_PAGE}
          onChange={(newPage) => setPage(newPage)}
        />
        : ""
    }
    <NoteSearchDisclaimer
      searchValue={searchValue}
      numberOfResults={numberOfResults}
    />
    <div
      className="note-list"
    >
      {
        notes.map((note, i) => {
          const isActive
            = !!activeNote
              && (!activeNote.isUnsaved)
              && (note.slug === activeNote.slug);

          const isLinked
            = !!activeNote
            && !activeNote.isUnsaved
            && (
              activeNote.outgoingLinks
                .map((n) => n.slug)
                .includes(note.slug)
              || activeNote.backlinks
                .map((n) => n.slug)
                .includes(note.slug)
            );

          return <NoteListItem
            note={note}
            isSelected={i === selectedIndex}
            isActive={isActive}
            isLinked={isLinked}
            key={`main-notes-list-item-${note.slug}`}
            onSelect={() => onSelect(note.slug)}
            isLinkable={itemsAreLinkable}
            onLinkIndicatorClick={() => {
              if (isActive) return;
              onLinkIndicatorClick(note.slug, note.title);
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
          searchResultsPerPage={SEARCH_RESULTS_PER_PAGE}
          onChange={(newPage) => setPage(newPage)}
        />
        : ""
    }
  </section>;
};

export default NoteList;
