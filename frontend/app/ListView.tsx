import React from "react";
import EditorViewHeader from "./EditorViewHeader";
import NoteList from "./NoteList";
import NoteListControls from "./NoteListControls";
import { DialogType } from "./enum/DialogType";
import SearchDialog from "./SearchDialog";

const ListView = ({
  toggleAppMenu,
  openDialog,
  setOpenDialog,
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
      showSearchDialog={() => setOpenDialog(DialogType.SEARCH)}
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
      displayedLinkedNotes={null}
      setUnsavedChanges={setUnsavedChanges}
      unsavedChanges={unsavedChanges}
    />
    {
      openDialog === DialogType.SEARCH
        ? <SearchDialog
          setSearchValue={(newSearchValue) => {
            setSearchValue(newSearchValue);
            setOpenDialog(null);
          }}
          onCancel={() => setOpenDialog(null)}
        />
        : null
    }
  </>;
};

export default ListView;
