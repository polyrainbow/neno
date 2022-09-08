import React, { useEffect, useState } from "react";
import NoteListItem from "./NoteListItem";
import useGoToNote from "../hooks/useGoToNote";
import SearchInput from "./SearchInput";
import {
  useNavigate,
} from "react-router-dom";
import useConfirmDiscardingUnsavedChangesDialog
  from "../hooks/useConfirmDiscardingUnsavedChangesDialog";
import {
  getAppPath,
} from "../lib/utils";
import { PathTemplate } from "../enum/PathTemplate";
import { l } from "../lib/intl";
import ActiveNote from "../interfaces/ActiveNote";
import LinkedNote from "../../../lib/notes/interfaces/LinkedNote";
import {
  FrontendUserNoteChangeNote,
} from "../interfaces/FrontendUserNoteChange";
import { NoteId } from "../../../lib/notes/interfaces/NoteId";
import {
  MainNoteListItem,
} from "../interfaces/NoteListItem";
import DatabaseProvider from "../interfaces/DatabaseProvider";
import DatabaseQuery from "../../../lib/notes/interfaces/DatabaseQuery";
import {
  NoteListSortMode,
} from "../../../lib/notes/interfaces/NoteListSortMode";


interface NoteLinksProps {
  note: ActiveNote,
  displayedLinkedNotes: (LinkedNote | FrontendUserNoteChangeNote)[],
  onLinkAddition: (note: MainNoteListItem) => void,
  onLinkRemoval: (noteId: NoteId) => void,
  setUnsavedChanges,
  databaseProvider: DatabaseProvider,
  unsavedChanges: boolean,
}


const NoteLinks = ({
  note,
  displayedLinkedNotes,
  onLinkAddition,
  onLinkRemoval,
  setUnsavedChanges,
  databaseProvider,
  unsavedChanges,
}: NoteLinksProps) => {
  const goToNote = useGoToNote();
  const [searchString, setSearchString] = useState<string>("");
  const [searchResults, setSearchResults] = useState<MainNoteListItem[]>([]);
  const navigate = useNavigate();
  const confirmDiscardingUnsavedChanges
    = useConfirmDiscardingUnsavedChangesDialog();

  const handleInvalidCredentialsError = async () => {
    await databaseProvider.removeAccess();
    // setDatabaseMode(DatabaseMode.NONE);
    navigate(getAppPath(PathTemplate.LOGIN));
  };


  const refreshNotesList = async () => {
    const options: DatabaseQuery = {
      page: 1,
      sortMode: NoteListSortMode.UPDATE_DATE_DESCENDING,
      searchString,
      caseSensitive: false,
      limit: 10,
    };

    // const requestId = crypto.randomUUID();
    // currentRequestId.current = requestId;
    try {
      const {
        results,
      } = await databaseProvider.getNotes(options);

      /*
      // ... some time later - check if this is the current request
      if (currentRequestId.current === requestId) {
        setNoteListItems(results);
        setNumberOfResults(numberOfResults);
        setNoteListIsBusy(false);
      }
      */

      setSearchResults(results);
    } catch (e) {
      // if credentials are invalid, go to LoginView. If not, throw.
      if (e instanceof Error && e.message === "INVALID_CREDENTIALS") {
        await handleInvalidCredentialsError();
      } else {
        throw e;
      }
    }
  };


  useEffect(() => {
    if (
      searchString.length === 0
    ) {
      setSearchResults([]);
      return;
    }
    refreshNotesList();
  }, [searchString]);


  return <div id="links">
    <h2>{l(
      "editor.linked-notes",
      { linkedNotes: displayedLinkedNotes.length.toString() },
    )}</h2>
    {
      displayedLinkedNotes.length === 0
        ? <p className="note-meta-paragraph"
        >{l("editor.no-notes-linked-yet")}</p>
        : null
    }
    <div id="links">
      {
        displayedLinkedNotes.map((displayedLinkedNote) => <NoteListItem
          key={"note-link-list-item-" + displayedLinkedNote.id}
          note={displayedLinkedNote}
          onSelect={async () => {
            if (unsavedChanges) {
              await confirmDiscardingUnsavedChanges();
              setUnsavedChanges(false);
            }

            goToNote(displayedLinkedNote.id);
          }}
          isActive={false}
          isLinked={true}
          onLinkChange={() => onLinkRemoval(displayedLinkedNote.id)}
          isLinkable={true}
        />)
      }
    </div>
    <h2>{l("editor.add-links")}</h2>
    <SearchInput
      value={searchString}
      placeholder={l("editor.note-search-placeholder")}
      onChange={(newValue) => setSearchString(newValue)}
      autoComplete="off"
      inputStyle={{
        width: "100%",
        marginTop: 0,
      }}
    />
    {
      searchResults
        .filter((noteListItem) => {
          // if the note is unsaved, we can be sure that every search
          // result is a valid one for displaying
          if (note.isUnsaved) return true;

          // if the note already exists, only show the search result if
          // is not the currently active note or if the result is already
          // added as linked note
          return (
            noteListItem.id !== note.id
            && !displayedLinkedNotes
              .map((note) => note.id)
              .includes(noteListItem.id)
          );
        })
        .map((noteListItem) => {
          return <NoteListItem
            key={"noteLinkAdditionSearchResult-" + noteListItem.id}
            note={noteListItem}
            onSelect={async () => {
              if (unsavedChanges) {
                await confirmDiscardingUnsavedChanges();
                setUnsavedChanges(false);
              }

              goToNote(noteListItem.id);
            }}
            isActive={false}
            isLinked={false}
            onLinkChange={() => onLinkAddition(noteListItem)}
            isLinkable={true}
          />;
        })
    }
  </div>;
};

export default NoteLinks;
