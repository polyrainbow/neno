import { useState } from "react";
import DatabaseProvider from "../types/DatabaseProvider";
import { MainNoteListItem } from "../types/NoteListItem";
import {
  NoteListSortMode,
} from "../../../lib/notes/interfaces/NoteListSortMode";
import { GraphId } from "../../../lib/notes/interfaces/GraphId";
import useNoteList from "./useNoteList";

interface ControlledNoteList {
  items: MainNoteListItem[],
  numberOfResults: number,
  isBusy: boolean,
  refresh,
  page: number,
  setPage,
  sortMode: NoteListSortMode,
  setSortMode,
  searchQuery: string,
  setSearchQuery,
  scrollTop: number,
  setScrollTop,
}

// hook for retrieving graph stats for the application header
// refreshes only when manually invoked
export default (
  databaseProvider: DatabaseProvider,
  graphId: GraphId,
  handleInvalidCredentialsError,
): ControlledNoteList => {
  const [searchQuery, setSearchQueryState] = useState<string>("");
  const [scrollTop, setScrollTop] = useState<number>(0);
  const [page, setPageState] = useState<number>(1);
  const [sortMode, setSortMode] = useState<NoteListSortMode>(
    NoteListSortMode.UPDATE_DATE_DESCENDING,
  );

  const setSearchQuery = (value) => {
    setSearchQueryState(value);
    setScrollTop(0);
    setPageState(1);
  };

  const setPage = (page) => {
    setPageState(page);
    setScrollTop(0);
  };

  const [
    noteListItems,
    numberOfResults,
    isBusy,
    refresh,
  ] = useNoteList(
    databaseProvider,
    graphId,
    {
      searchQuery,
      sortMode,
      page,
      handleInvalidCredentialsError,
    },
  );

  return {
    items: noteListItems,
    numberOfResults,
    isBusy,
    refresh,
    page,
    setPage,
    sortMode,
    setSortMode,
    searchQuery,
    setSearchQuery,
    scrollTop,
    setScrollTop,
  };
};
