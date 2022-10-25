import React, { useEffect } from "react";
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
import useHeaderStats from "../hooks/useHeaderStats";
import usePinnedNotes from "../hooks/usePinnedNotes";


const ListView = () => {
  const graphId = useGraphId();
  const navigate = useNavigate();
  const databaseProvider = useDatabaseProvider();

  const handleInvalidCredentialsError = async () => {
    await databaseProvider?.removeAccess();
    navigate(getAppPath(PathTemplate.LOGIN));
  };

  const controlledNoteList = useControlledNoteList(
    databaseProvider,
    graphId,
    handleInvalidCredentialsError,
  );

  const [headerStats, refreshHeaderStats] = useHeaderStats(
    databaseProvider,
    graphId,
  );

  const {
    pinnedNotes,
    refreshPinnedNotes,
  } = usePinnedNotes(databaseProvider, graphId);

  useEffect(() => {
    refreshPinnedNotes();
  }, []);

  return <>
    <NoteViewHeader
      stats={headerStats}
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
        refreshHeaderStats();
        controlledNoteList.refresh();
        refreshPinnedNotes();
      }}
      noteListItems={controlledNoteList.items}
      numberOfResults={controlledNoteList.numberOfResults}
      activeNote={null} /* in list view, no note is active */
      noteListIsBusy={controlledNoteList.isBusy}
      noteListScrollTop={controlledNoteList.scrollTop}
      setNoteListScrollTop={controlledNoteList.setScrollTop}
      page={controlledNoteList.page}
      setPage={controlledNoteList.setPage}
      stats={headerStats}
      itemsAreLinkable={false}
      onLinkAddition={null}
      onLinkRemoval={null}
      displayedLinkedNotes={[]}
      graphId={graphId}
    />
    <FloatingActionButton
      title={l("editor.new-note")}
      icon="add"
      onClick={() => navigate(getAppPath(
        PathTemplate.NEW_NOTE,
        new Map([["GRAPH_ID", graphId]]),
      ))}
    ></FloatingActionButton>
  </>;
};

export default ListView;
