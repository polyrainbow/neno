import React from "react";
import NoteViewHeader from "./NoteViewHeader";
import NoteListWithControls from "./NoteListWithControls";
import { useNavigate } from "react-router-dom";
import FloatingActionButton from "./FloatingActionButton";
import { l } from "../lib/intl";
import { getAppPath } from "../lib/utils";
import { PathTemplate } from "../enum/PathTemplate";
import useControlledNoteList from "../hooks/useControlledNoteList";
import useDatabaseProvider from "../hooks/useDatabaseProvider";
import useGraphId from "../hooks/useGraphId";

interface ListViewProps {
  refreshContentViews,
  stats,
  pinnedNotes,
}

const ListView = ({
  refreshContentViews,
  stats,
  pinnedNotes,
}: ListViewProps) => {
  const graphId = useGraphId();
  const navigate = useNavigate();
  const databaseProvider = useDatabaseProvider();

  const handleInvalidCredentialsError = async () => {
    await databaseProvider?.removeAccess();
    // setDatabaseMode(DatabaseMode.NONE);
    navigate(getAppPath(PathTemplate.LOGIN));
  };

  const controlledNoteList = useControlledNoteList(
    databaseProvider,
    graphId,
    handleInvalidCredentialsError,
  );

  return <>
    <NoteViewHeader
      stats={stats}
      pinnedNotes={pinnedNotes}
      activeNote={null} /* in list view, no note is active */
      graphId={graphId}
    />
    <NoteListWithControls
      handleSearchInputChange={controlledNoteList.setSearchQuery}
      searchValue={controlledNoteList.searchQuery}
      sortMode={controlledNoteList.sortMode}
      handleSortModeChange={controlledNoteList.setSortMode}
      refreshContentViews={() => {
        refreshContentViews();
        controlledNoteList.refresh();
      }}
      noteListItems={controlledNoteList.items}
      numberOfResults={controlledNoteList.numberOfResults}
      activeNote={null} /* in list view, no note is active */
      noteListIsBusy={controlledNoteList.isBusy}
      noteListScrollTop={controlledNoteList.scrollTop}
      setNoteListScrollTop={controlledNoteList.setScrollTop}
      page={controlledNoteList.page}
      setPage={controlledNoteList.setPage}
      stats={stats}
      itemsAreLinkable={false}
      onLinkAddition={null}
      onLinkRemoval={null}
      displayedLinkedNotes={[]}
      graphId={graphId}
    />
    <FloatingActionButton
      title={l("editor.new-note")}
      icon="add"
      onClick={() => navigate(getAppPath(PathTemplate.NEW_NOTE))}
    ></FloatingActionButton>
  </>;
};

export default ListView;
