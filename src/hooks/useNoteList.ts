import { useCallback, useEffect, useRef, useState } from "react";
import NoteListItem from "../lib/notes/types/NoteListItem";
import * as Config from "../config";
import DatabaseQuery from "../lib/notes/types/DatabaseQuery";
import {
  NoteListSortMode,
} from "../lib/notes/types/NoteListSortMode";
import NotesProvider from "../lib/notes";

type NoteList = [
  NoteListItem[], number, boolean, () => Promise<void>,
];

// hook for retrieving graph stats for the application header
// refreshes only when manually invoked
export default (
  notesProvider: NotesProvider,
  {
    searchQuery,
    sortMode,
    page,
  }: {
    searchQuery: string,
    sortMode: NoteListSortMode,
    page: number,
  },
): NoteList => {
  const currentRequestId = useRef<string>("");
  const [noteListItems, setNoteListItems] = useState<NoteListItem[]>([]);
  const [numberOfResults, setNumberOfResults] = useState<number>(NaN);
  const [isBusy, setIsBusy] = useState<boolean>(true);

  const refreshNoteList = useCallback(
    async () => {
      setNoteListItems([]);

      // if searchValue is given but below MINIMUM_SEARCH_QUERY_LENGTH,
      // we don't do anything and leave the note list empty
      if (
        searchQuery.length > 0
        && searchQuery.length < Config.MINIMUM_SEARCH_QUERY_LENGTH
      ) {
        return;
      }

      setIsBusy(true);

      const options: DatabaseQuery = {
        page,
        sortMode,
        caseSensitive: false,
      };

      if (searchQuery.length >= Config.MINIMUM_SEARCH_QUERY_LENGTH) {
        options.searchString = searchQuery;
      }

      const requestId = crypto.randomUUID();
      currentRequestId.current = requestId;

      const {
        results,
        numberOfResults,
      } = await notesProvider.getNotesList(options);

      // ... some time later - check if this is the current request
      if (currentRequestId.current === requestId) {
        setNoteListItems(results);
        setNumberOfResults(numberOfResults);
        setIsBusy(false);
      }
    },
    [searchQuery, page, sortMode, notesProvider],
  );

  useEffect(() => {
    refreshNoteList();
  }, [page, sortMode, searchQuery]);

  return [noteListItems, numberOfResults, isBusy, refreshNoteList];
};
