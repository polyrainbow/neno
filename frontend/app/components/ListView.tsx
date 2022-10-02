import React from "react";
import NoteViewHeader from "./NoteViewHeader";
import NoteListWithControls from "./NoteListWithControls";

const ListView = ({
  toggleAppMenu,
  refreshContentViews,
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
  unsavedChanges,
  setUnsavedChanges,
}) => {
  return <>
    <NoteViewHeader
      stats={stats}
      toggleAppMenu={toggleAppMenu}
      pinnedNotes={pinnedNotes}
      activeNote={null} /* in list view, no note is active */
      setUnsavedChanges={setUnsavedChanges}
      unsavedChanges={unsavedChanges}
    />
    <NoteListWithControls
      handleSearchInputChange={handleSearchInputChange}
      searchValue={searchValue}
      sortMode={sortMode}
      handleSortModeChange={handleSortModeChange}
      refreshContentViews={refreshContentViews}
      noteListItems={noteListItems}
      numberOfResults={numberOfResults}
      activeNote={null} /* in list view, no note is active */
      noteListIsBusy={noteListIsBusy}
      noteListScrollTop={noteListScrollTop}
      setNoteListScrollTop={setNoteListScrollTop}
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
