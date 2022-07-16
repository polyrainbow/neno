import { useCallback, useRef, useState } from "react";
import DatabaseProvider from "../interfaces/DatabaseProvider";
import { MainNoteListItem } from "../interfaces/NoteListItem";
import * as Config from "../config";
import DatabaseQuery from "../../../lib/notes/interfaces/DatabaseQuery";
import {
  NoteListSortMode,
} from "../../../lib/notes/interfaces/NoteListSortMode";

// hook for retrieving graph stats for the application header
// refreshes only when manually invoked
export default (
  databaseProvider: DatabaseProvider | null,
  {
    searchValue,
    sortMode,
    page,
    handleInvalidCredentialsError,
  }: {
    searchValue: string,
    sortMode: NoteListSortMode,
    page: number,
    handleInvalidCredentialsError: () => Promise<void>,
  },
): [MainNoteListItem[], number, boolean, () => Promise<void>] => {
  const currentRequestId = useRef<string>("");
  const [noteListItems, setNoteListItems] = useState<MainNoteListItem[]>([]);
  const [numberOfResults, setNumberOfResults] = useState<number>(NaN);
  const [isBusy, setIsBusy] = useState<boolean>(true);

  const refreshNoteList = useCallback(
    async () => {
      if (!databaseProvider) return;

      setNoteListItems([]);

      // if searchValue is given but below MINIMUM_SEARCH_QUERY_LENGTH,
      // we don't do anything and leave the note list empty
      if (
        searchValue.length > 0
        && searchValue.length < Config.MINIMUM_SEARCH_QUERY_LENGTH
      ) {
        return;
      }

      setIsBusy(true);

      const options: DatabaseQuery = {
        page,
        sortMode,
        caseSensitive: false,
      };

      if (searchValue.length >= Config.MINIMUM_SEARCH_QUERY_LENGTH) {
        options.searchString = searchValue;
      }

      const requestId = crypto.randomUUID();
      currentRequestId.current = requestId;
      try {
        const {
          results,
          numberOfResults,
        } = await databaseProvider.getNotes(options);

        // ... some time later - check if this is the current request
        if (currentRequestId.current === requestId) {
          setNoteListItems(results);
          setNumberOfResults(numberOfResults);
          setIsBusy(false);
        }
      } catch (e) {
        // if credentials are invalid, go to LoginView. If not, throw.
        if (e instanceof Error && e.message === "INVALID_CREDENTIALS") {
          await handleInvalidCredentialsError();
        } else {
          throw e;
        }
      }
    },
    [searchValue, page, sortMode, databaseProvider],
  );

  return [noteListItems, numberOfResults, isBusy, refreshNoteList];
};
