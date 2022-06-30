import React from "react";
import EditorViewHeader from "./EditorViewHeader";
import NoteList from "./NoteList";
import NoteListControls from "./NoteListControls";
import { DialogType } from "../enum/DialogType";
import useDialog from "../hooks/useDialog";

const ListView = ({
  toggleAppMenu,
  refreshNotesList,
  stats,
  pinnedNotes,
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
  setSearchValue,
  unsavedChanges,
  setUnsavedChanges,
}) => {
  const openSearchDialog = useDialog(DialogType.SEARCH, setSearchValue);

  return <>
    <EditorViewHeader
      stats={stats}
      toggleAppMenu={toggleAppMenu}
      pinnedNotes={pinnedNotes}
      activeNote={null} /* in list view, no note is active */
      setUnsavedChanges={setUnsavedChanges}
      unsavedChanges={unsavedChanges}
    />
    <NoteListControls
      onChange={handleSearchInputChange}
      value={searchValue}
      sortMode={sortMode}
      setSortMode={handleSortModeChange}
      openSearchDialog={openSearchDialog}
      refreshNoteList={refreshNotesList}
    />
    <NoteList
      notes={noteListItems}
      numberOfResults={numberOfResults}
      activeNote={null} /* in list view, no note is active */
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
      itemsAreLinkable={false}
      onLinkAddition={null}
      onLinkRemoval={null}
      displayedLinkedNotes={[]}
      setUnsavedChanges={setUnsavedChanges}
      unsavedChanges={unsavedChanges}
    />
  </>;
};

export default ListView;
