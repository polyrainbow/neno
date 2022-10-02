import React from "react";
import NoteList from "./NoteList";
import NoteListControls from "./NoteListControls";
import { DialogType } from "../enum/DialogType";
import useDialog from "../hooks/useDialog";

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
  const openSearchDialog = useDialog(
    DialogType.SEARCH,
    handleSearchInputChange,
  );

  return <>
    <NoteListControls
      onChange={handleSearchInputChange}
      value={searchValue}
      sortMode={sortMode}
      setSortMode={handleSortModeChange}
      openSearchDialog={openSearchDialog}
      refreshNoteList={refreshContentViews}
    />
    <NoteList
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
  </>;
};

export default NoteListWithControls;
