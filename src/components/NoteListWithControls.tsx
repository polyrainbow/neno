import { useContext, useRef, useState } from "react";
import {
  NoteListSortMode,
} from "../lib/notes/types/NoteListSortMode";
import UnsavedChangesContext from "../contexts/UnsavedChangesContext";
import NoteList from "./NoteList";
import NoteListControls from "./NoteListControls";
import SearchPresets from "./SearchPresets";
import { Slug } from "../lib/notes/types/Slug";
import NoteListItemType from "../lib/notes/types/NoteListItem";
import ActiveNote from "../types/ActiveNote";
import useKeyboardShortcuts from "../hooks/useKeyboardShortcuts";
import useGoToNote from "../hooks/useGoToNote";
import useConfirmDiscardingUnsavedChangesDialog
  from "../hooks/useConfirmDiscardingUnsavedChangesDialog";

export enum NoteListView {
  DEFAULT = "default",
  SEARCH_PRESETS = "search-presets",
}

interface NoteListWithControlsProps {
  numberOfAllNotes?: number,
  handleSearchInputChange: (value: string) => void,
  searchValue: string,
  sortMode: NoteListSortMode,
  handleSortModeChange: (mode: NoteListSortMode) => void,
  noteListItems: NoteListItemType[],
  numberOfResults: number,
  noteListIsBusy: boolean,
  noteListScrollTop: number,
  setNoteListScrollTop: (scrollTop: number) => void,
  page: number,
  setPage: (newPage: number) => void,
  activeNote: ActiveNote | null,
  selectedIndex: number,
  setSelectedIndex: (value: number) => void,
  itemsAreLinkable: boolean,
  onLinkIndicatorClick: (slug: Slug, title: string) => void,
}

const NoteListWithControls = ({
  numberOfAllNotes,
  handleSearchInputChange,
  searchValue,
  sortMode,
  handleSortModeChange,
  noteListItems,
  numberOfResults,
  noteListIsBusy,
  noteListScrollTop,
  setNoteListScrollTop,
  page,
  setPage,
  activeNote,
  itemsAreLinkable,
  onLinkIndicatorClick,
  selectedIndex,
  setSelectedIndex,
}: NoteListWithControlsProps) => {
  const [view, setView] = useState<NoteListView>(NoteListView.DEFAULT);
  const noteListWithControlsRef = useRef<HTMLElement | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useContext(UnsavedChangesContext);
  const goToNote = useGoToNote();
  const confirmDiscardingUnsavedChanges
    = useConfirmDiscardingUnsavedChangesDialog();

  const handleNoteSelection = async (slug: Slug) => {
    if (
      activeNote
      && "slug" in activeNote
      && activeNote.slug === slug
    ) {
      return;
    }

    if (unsavedChanges) {
      await confirmDiscardingUnsavedChanges();
      setUnsavedChanges(false);
    }
    goToNote(slug);
  };

  useKeyboardShortcuts(
    {
      onArrowUp: () => {
        const newIndex = selectedIndex > -1
          ? selectedIndex - 1
          : selectedIndex;
        setSelectedIndex(newIndex);
      },
      onArrowDown: () => {
        const newIndex = selectedIndex < noteListItems.length - 1
          ? selectedIndex + 1
          : selectedIndex;
        setSelectedIndex(newIndex);
      },
      onEnter: async () => {
        if (selectedIndex > -1) {
          const note = noteListItems[selectedIndex];
          if (note) {
            handleNoteSelection(note.slug);
          }
        }
      },
    },
    noteListWithControlsRef,
  );

  return <section
    ref={noteListWithControlsRef}
  >
    <NoteListControls
      onChange={handleSearchInputChange}
      value={searchValue}
      sortMode={sortMode}
      setSortMode={handleSortModeChange}
      view={view}
      setView={setView}
    />
    {
      view === NoteListView.DEFAULT
        ? <NoteList
          notes={noteListItems}
          numberOfResults={numberOfResults}
          activeNote={activeNote}
          isBusy={noteListIsBusy}
          searchValue={searchValue}
          scrollTop={noteListScrollTop}
          setScrollTop={setNoteListScrollTop}
          sortMode={sortMode}
          page={page}
          onSelect={(slug: Slug) => handleNoteSelection(slug)}
          setPage={(page) => {
            setPage(page);
            setNoteListScrollTop(0);
          }}
          numberOfAllNotes={numberOfAllNotes}
          itemsAreLinkable={itemsAreLinkable}
          setUnsavedChanges={setUnsavedChanges}
          unsavedChanges={unsavedChanges}
          onLinkIndicatorClick={onLinkIndicatorClick}
          selectedIndex={selectedIndex}
        />
        : <SearchPresets
          onSelect={(preset) => {
            handleSearchInputChange(preset);
            setView(NoteListView.DEFAULT);
          }}
          currentQuery={searchValue}
          onClose={() => setView(NoteListView.DEFAULT)}
        />
    }
  </section>;
};

export default NoteListWithControls;
