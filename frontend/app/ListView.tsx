import React, {
  useEffect, useState, useCallback, useRef,
} from "react";
import { v4 as uuidv4 } from "uuid";
import EditorViewHeader from "./EditorViewHeader.js";
import NoteList from "./NoteList.js";
import NoteListControls from "./NoteListControls.js";
import * as Utils from "./lib/utils.js";
import * as Config from "./lib/config.js";
import ConfirmationServiceContext from "./ConfirmationServiceContext.js";
import {
  useHistory,
} from "react-router-dom";


const ListView = ({
  databaseProvider,
  unsavedChanges,
  setUnsavedChanges,
  toggleAppMenu,
  handleInvalidCredentialsError,
}) => {
  const currentRequestId = useRef(null);
  const [noteListItems, setNoteListItems] = useState([]);
  const [numberOfResults, setNumberOfResults] = useState([]);
  const [noteListScrollTop, setNoteListScrollTop] = useState(0);
  const [page, setPage] = useState(1);
  const [isBusy, setIsBusy] = useState(true);
  const [stats, setStats] = useState(null);
  const [sortMode, setSortMode] = useState("CREATION_DATE_DESCENDING");
  const [activeNote, setActiveNote] = useState(Utils.getNewNoteObject());
  const [searchValue, setSearchValue] = useState("");
  const [pinnedNotes, setPinnedNotes] = useState([]);

  const history = useHistory();
  const confirm = React.useContext(ConfirmationServiceContext) as (any) => void;


  const handleSearchInputChange = (value) => {
    setSearchValue(value);
    setNoteListScrollTop(0);
    setPage(1);
  };


  const loadNote = async (noteId) => {
    if (unsavedChanges) {
      await confirm({
        text: Config.texts.discardChangesConfirmation,
        confirmText: "Discard changes",
        cancelText: "Cancel",
        encourageConfirmation: false,
      });

      setUnsavedChanges(false);
    }

    let noteIdNumber = noteId;

    if (typeof noteIdNumber !== "number") {
      noteIdNumber = parseInt(noteIdNumber);
    }

    if (isNaN(noteIdNumber)) {
      history.replace(Config.paths.newNote);
      setActiveNote(Utils.getNewNoteObject());
    } else {
      try {
        const noteFromServer = await databaseProvider.getNote(noteIdNumber);
        setActiveNote({
          ...noteFromServer,
          isUnsaved: false,
          changes: [],
        });
      } catch (e) {
        // if credentials are invalid, go to LoginView. If not, throw.
        if (e.message === "INVALID_CREDENTIALS") {
          await handleInvalidCredentialsError();
        } else {
          throw new Error(e);
        }
      }
    }
  };


  const refreshStats = () => {
    if (!databaseProvider) return;

    databaseProvider.getStats(false)
      .then((stats) => {
        setStats(stats);
      })
      .catch((e) => {
        // if credentials are invalid, it's fine, refeshNotesList takes care of
        // this. if there is another error, throw.
        if (e.message !== "INVALID_CREDENTIALS") {
          throw new Error(e);
        }
      });
  };


  const refreshNotesList = async () => {
    if (!databaseProvider) return;

    refreshStats();
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

    const options = {
      page,
      sortMode,
      query: "",
      caseSensitive: false,
    };

    if (searchValue.length >= Config.MINIMUM_SEARCH_QUERY_LENGTH) {
      options.query = searchValue;
    }

    const requestId = uuidv4();
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

      const pinnedNotes = await databaseProvider.getPins();
      setPinnedNotes(pinnedNotes);
    } catch (e) {
      // if credentials are invalid, go to LoginView. If not, throw.
      if (e.message === "INVALID_CREDENTIALS") {
        await handleInvalidCredentialsError();
      } else {
        throw new Error(e);
      }
    }
  };


  useEffect(() => {
    refreshNotesList();
  }, [searchValue, page, sortMode, databaseProvider]);


  return <>
    <EditorViewHeader
      stats={stats}
      toggleAppMenu={toggleAppMenu}
      pinnedNotes={pinnedNotes}
      note={activeNote}
    />
    <NoteListControls
      onChange={handleSearchInputChange}
      value={searchValue}
      sortMode={sortMode}
      setSortMode={(sortMode) => {
        setNoteListScrollTop(0);
        setSortMode(sortMode);
        setPage(1);
      }}
      showNotesWithDuplicateURLs={() => handleSearchInputChange(
        "special:DUPLICATE_URLS",
      )}
    />
    <NoteList
      notes={noteListItems}
      numberOfResults={numberOfResults}
      activeNote={activeNote}
      isBusy={isBusy}
      searchValue={searchValue}
      scrollTop={noteListScrollTop}
      setScrollTop={setNoteListScrollTop}
      sortMode={sortMode}
      page={page}
      setPage={(page) => {
        setPage(page);
        setNoteListScrollTop(0);
      }}
      stats={stats}
      itemsAreLinkable={false}
      onLinkAddition={null}
      onLinkRemoval={null}
      displayedLinkedNotes={null}
    />
  </>;
};

export default ListView;
