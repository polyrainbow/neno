import React, { useContext, useState } from "react";
import { GraphId } from "../../../lib/notes/interfaces/GraphId";
import {
  NoteListSortMode,
} from "../../../lib/notes/interfaces/NoteListSortMode";
import UnsavedChangesContext from "../contexts/UnsavedChangesContext";
import NoteList from "./NoteList";
import NoteListControls from "./NoteListControls";
import SearchPresets from "./SearchPresets";

type View = "note-list" | "search-presets";

interface NoteListWithControlsProps {
  refreshContentViews,
  stats,
  handleSearchInputChange,
  searchValue,
  sortMode: NoteListSortMode,
  handleSortModeChange,
  noteListItems,
  numberOfResults,
  noteListIsBusy,
  noteListScrollTop: number,
  setNoteListScrollTop,
  page: number,
  setPage,
  activeNote,
  itemsAreLinkable,
  onLinkAddition,
  onLinkRemoval,
  displayedLinkedNotes,
  graphId: GraphId,
}

const NoteListWithControls = ({
  refreshContentViews,
  stats,
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
  onLinkAddition,
  onLinkRemoval,
  displayedLinkedNotes,
  graphId,
}: NoteListWithControlsProps) => {
  const [view, setView] = useState<View>("note-list");
  const [unsavedChanges, setUnsavedChanges] = useContext(UnsavedChangesContext);

  return <>
    <NoteListControls
      onChange={handleSearchInputChange}
      value={searchValue}
      sortMode={sortMode}
      setSortMode={handleSortModeChange}
      view={view}
      setView={setView}
      refreshNoteList={refreshContentViews}
    />
    {
      view === "note-list"
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
          stats={stats}
          itemsAreLinkable={itemsAreLinkable}
          onLinkAddition={onLinkAddition}
          onLinkRemoval={onLinkRemoval}
          displayedLinkedNotes={displayedLinkedNotes}
          setUnsavedChanges={setUnsavedChanges}
          unsavedChanges={unsavedChanges}
          graphId={graphId}
        />
        : <SearchPresets
          onSelect={(preset) => {
            handleSearchInputChange(preset);
            setView("note-list");
          }}
          currentQuery={searchValue}
        />
    }

  </>;
};

export default NoteListWithControls;
