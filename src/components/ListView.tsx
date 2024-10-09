import { useEffect } from "react";
import NoteViewHeader from "./NoteViewHeader";
import NoteListWithControls from "./NoteListWithControls";
import { useNavigate } from "react-router-dom";
import FloatingActionButton from "./FloatingActionButton";
import { l } from "../lib/intl";
import { getAppPath } from "../lib/utils";
import { PathTemplate } from "../types/PathTemplate";
import useControlledNoteList from "../hooks/useControlledNoteList";
import useNotesProvider from "../hooks/useNotesProvider";
import useHeaderStats from "../hooks/useHeaderStats";
import usePinnedNotes from "../hooks/usePinnedNotes";
import { LOCAL_GRAPH_ID } from "../config";


const ListView = () => {
  const navigate = useNavigate();
  const notesProvider = useNotesProvider();

  const controlledNoteList = useControlledNoteList(notesProvider);

  const [headerStats] = useHeaderStats(
    notesProvider,
  );

  const {
    pinnedNotes,
    refreshPinnedNotes,
    move,
  } = usePinnedNotes(notesProvider);

  useEffect(() => {
    refreshPinnedNotes();
  }, []);

  return <>
    <NoteViewHeader
      stats={headerStats}
      pinnedNotes={pinnedNotes}
      activeNote={null} /* in list view, no note is active */
      movePin={move}
    />
    <NoteListWithControls
      handleSearchInputChange={controlledNoteList.setSearchQuery}
      searchValue={controlledNoteList.searchQuery}
      sortMode={controlledNoteList.sortMode}
      handleSortModeChange={controlledNoteList.setSortMode}
      noteListItems={controlledNoteList.items}
      numberOfResults={controlledNoteList.numberOfResults}
      activeNote={null} /* in list view, no note is active */
      noteListIsBusy={controlledNoteList.isBusy}
      noteListScrollTop={controlledNoteList.scrollTop}
      setNoteListScrollTop={controlledNoteList.setScrollTop}
      page={controlledNoteList.page}
      setPage={controlledNoteList.setPage}
      itemsAreLinkable={false}
      onLinkIndicatorClick={() => {
        return;
      }}
      selectedIndex={controlledNoteList.selectedIndex}
      setSelectedIndex={controlledNoteList.setSelectedIndex}
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
