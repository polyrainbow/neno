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
import ActiveNote from "../types/ActiveNote";
import LinkedNote from "../../../lib/notes/interfaces/LinkedNote";
import {
  FrontendUserNoteChangeNote,
} from "../types/FrontendUserNoteChange";
import { NoteId } from "../../../lib/notes/interfaces/NoteId";
import {
  MainNoteListItem,
} from "../types/NoteListItem";
import DatabaseQuery from "../../../lib/notes/interfaces/DatabaseQuery";
import {
  NoteListSortMode,
} from "../../../lib/notes/interfaces/NoteListSortMode";
import { GraphId } from "../../../lib/notes/interfaces/GraphId";
import useDatabaseProvider from "../hooks/useDatabaseProvider";


interface NoteLinksProps {
  note: ActiveNote,
  displayedLinkedNotes: (LinkedNote | FrontendUserNoteChangeNote)[],
  onLinkAddition: (note: MainNoteListItem) => void,
  onLinkRemoval: (noteId: NoteId) => void,
  setUnsavedChanges,
  unsavedChanges: boolean,
  graphId: GraphId,
}


const NoteLinks = ({
  note,
  displayedLinkedNotes,
  onLinkAddition,
  onLinkRemoval,
  setUnsavedChanges,
  unsavedChanges,
  graphId,
}: NoteLinksProps) => {
  const databaseProvider = useDatabaseProvider();

  const goToNote = useGoToNote();
  const [searchString, setSearchString] = useState<string>("");
  const [searchResults, setSearchResults] = useState<MainNoteListItem[]>([]);
  const navigate = useNavigate();
  const confirmDiscardingUnsavedChanges
    = useConfirmDiscardingUnsavedChangesDialog();

  const handleInvalidCredentialsError = async () => {
    await databaseProvider?.removeAccess();
    navigate(getAppPath(PathTemplate.LOGIN));
  };


  const refreshNotesList = async () => {
    if (!databaseProvider) throw new Error("DatabaseProvider not ready!");

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
      } = await databaseProvider.getNotes(graphId, options);

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

            goToNote(graphId, displayedLinkedNote.id);
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
          // only display search result if it is not the same as the active note
          // and if the result has not already been added as linked note
          return (
            (
              note.isUnsaved
              || (noteListItem.id !== note.id)
            )
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

              goToNote(graphId, noteListItem.id);
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
