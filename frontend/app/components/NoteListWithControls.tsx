import React, { useState } from "react";
import NoteList from "./NoteList";
import NoteListControls from "./NoteListControls";
import SearchPresets from "./SearchPresets";

type View = "note-list" | "search-presets";

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
  unsavedChanges,
  setUnsavedChanges,
  activeNote,
  itemsAreLinkable,
  onLinkAddition,
  onLinkRemoval,
  displayedLinkedNotes,
}) => {
  const [view, setView] = useState<View>("note-list");

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
