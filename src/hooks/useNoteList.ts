import { useCallback, useEffect, useRef, useState } from "react";
import NoteListItem from "../lib/notes/types/NoteListItem";
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
      setIsBusy(true);

      const options: DatabaseQuery = {
        page,
        sortMode,
        caseSensitive: false,
      };

      options.searchString = searchQuery;

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
