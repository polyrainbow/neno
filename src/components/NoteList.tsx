import { useEffect, useRef } from "react";
import NoteListStatus from "./NoteListStatus";
import NoteListItem from "./NoteListItem";
import Pagination from "./Pagination";
import NoteSearchDisclaimer from "./NoteSearchDisclaimer";
import useGoToNote from "../hooks/useGoToNote";
import { SEARCH_RESULTS_PER_PAGE } from "../config";
import useConfirmDiscardingUnsavedChangesDialog
  from "../hooks/useConfirmDiscardingUnsavedChangesDialog";
import ActiveNote from "../types/ActiveNote";
import {
  NoteListSortMode,
} from "../lib/notes/interfaces/NoteListSortMode";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import NoteListItemType from "../lib/notes/interfaces/NoteListItem";
import GraphStats from "../lib/notes/interfaces/GraphStats";
import { Slug } from "../lib/notes/interfaces/Slug";


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
  stats: GraphStats,
  itemsAreLinkable: boolean,
  unsavedChanges: boolean,
  setUnsavedChanges: (unsavedChanges: boolean) => void,
  onLinkIndicatorClick: (slug: Slug, title: string) => void,
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
  stats,
  itemsAreLinkable,
  unsavedChanges,
  setUnsavedChanges,
  onLinkIndicatorClick,
}: NoteListProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const goToNote = useGoToNote();
  const confirmDiscardingUnsavedChanges
    = useConfirmDiscardingUnsavedChangesDialog();
  const isSmallScreen = useIsSmallScreen();

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
      container && setScrollTop(container.scrollTop);
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
    return <NoteListStatus
      status={status}
    />;
  }

  if (!Array.isArray(notes) || (notes.length === 0)) {
    return <NoteListStatus
      status="NO_NOTES_FOUND"
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
      stats={stats}
    />
    <div className="note-list">
      {
        notes.map((note) => {
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
            isActive={isActive}
            isLinked={isLinked}
            key={`main-notes-list-item-${note.slug}`}
            onSelect={async () => {
              if (
                activeNote
                && "slug" in activeNote
                && activeNote.slug === note.slug
              ) {
                return;
              }

              if (unsavedChanges) {
                await confirmDiscardingUnsavedChanges();
                setUnsavedChanges(false);
              }

              goToNote(note.slug);
            }}
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
