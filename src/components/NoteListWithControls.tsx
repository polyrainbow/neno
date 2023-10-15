import { useContext, useState } from "react";
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
}: NoteListWithControlsProps) => {
  const [view, setView] = useState<NoteListView>(NoteListView.DEFAULT);
  const [unsavedChanges, setUnsavedChanges] = useContext(UnsavedChangesContext);

  return <>
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
          setPage={(page) => {
            setPage(page);
            setNoteListScrollTop(0);
          }}
          numberOfAllNotes={numberOfAllNotes}
          itemsAreLinkable={itemsAreLinkable}
          setUnsavedChanges={setUnsavedChanges}
          unsavedChanges={unsavedChanges}
          onLinkIndicatorClick={onLinkIndicatorClick}
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
  </>;
};

export default NoteListWithControls;
