import { useEffect } from "react";
import NoteViewHeader from "./NoteViewHeader";
import NoteListWithControls from "./NoteListWithControls";
import { useNavigate } from "react-router-dom";
import FloatingActionButton from "./FloatingActionButton";
import { l } from "../lib/intl";
import { getAppPath } from "../lib/utils";
import { PathTemplate } from "../enum/PathTemplate";
import useControlledNoteList from "../hooks/useControlledNoteList";
import useNotesProvider from "../hooks/useNotesProvider";
import useHeaderStats from "../hooks/useHeaderStats";
import usePinnedNotes from "../hooks/usePinnedNotes";
import { removeAccess } from "../lib/LocalDataStorage";
import { LOCAL_GRAPH_ID } from "../config";


const ListView = () => {
  const navigate = useNavigate();
  const databaseProvider = useNotesProvider();

  const handleInvalidCredentialsError = async () => {
    await removeAccess();
    navigate(getAppPath(PathTemplate.LOGIN));
  };

  const controlledNoteList = useControlledNoteList(
    databaseProvider,
    handleInvalidCredentialsError,
  );

  const [headerStats, refreshHeaderStats] = useHeaderStats(
    databaseProvider,
  );

  const {
    pinnedNotes,
    refreshPinnedNotes,
  } = usePinnedNotes(databaseProvider);

  useEffect(() => {
    refreshPinnedNotes();
  }, []);

  return <>
    <NoteViewHeader
      stats={headerStats}
      pinnedNotes={pinnedNotes}
      activeNote={null} /* in list view, no note is active */
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
      onLinkIndicatorClick={() => {
        return;
      }}
    />
    <FloatingActionButton
      title={l("editor.new-note")}
      icon="add"
      onClick={() => navigate(getAppPath(
        PathTemplate.NEW_NOTE,
        new Map([["GRAPH_ID", LOCAL_GRAPH_ID]]),
      ))}
    ></FloatingActionButton>
  </>;
};

export default ListView;