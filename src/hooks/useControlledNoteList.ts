import { useState } from "react";
import {
  NoteListSortMode,
} from "../lib/notes/interfaces/NoteListSortMode";
import useNoteList from "./useNoteList";
import NoteListItem from "../lib/notes/interfaces/NoteListItem";
import NotesProvider from "../lib/notes";

const SORT_MODE_LOCAL_STORAGE_KEY = "NOTE_LIST_SORT_MODE";

interface ControlledNoteList {
  items: NoteListItem[],
  numberOfResults: number,
  isBusy: boolean,
  refresh: () => void,
  page: number,
  setPage: (page: number) => void,
  sortMode: NoteListSortMode,
  setSortMode: (value: NoteListSortMode) => void,
  searchQuery: string,
  setSearchQuery: (value: string) => void,
  scrollTop: number,
  setScrollTop: (value: number) => void,
}

// hook for retrieving graph stats for the application header
// refreshes only when manually invoked
export default (
  notesProvider: NotesProvider,
): ControlledNoteList => {
  const [searchQuery, setSearchQueryState] = useState<string>("");
  const [scrollTop, setScrollTop] = useState<number>(0);
  const [page, setPageState] = useState<number>(1);
  const initialSortMode = localStorage.getItem(
    SORT_MODE_LOCAL_STORAGE_KEY,
  ) as NoteListSortMode ?? NoteListSortMode.UPDATE_DATE_DESCENDING;
  const [sortMode, setSortMode] = useState<NoteListSortMode>(initialSortMode);

  const setSearchQuery = (value: string) => {
    setSearchQueryState(value);
    setScrollTop(0);
    setPageState(1);
  };

  const setPage = (page: number) => {
    setPageState(page);
    setScrollTop(0);
  };

  const [
    noteListItems,
    numberOfResults,
    isBusy,
    refresh,
  ] = useNoteList(
    notesProvider,
    {
      searchQuery,
      sortMode,
      page,
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
    setSortMode: (value) => {
      setSortMode(value);
      localStorage.setItem(SORT_MODE_LOCAL_STORAGE_KEY, value);
    },
    searchQuery,
    setSearchQuery,
    scrollTop,
    setScrollTop,
  };
};
