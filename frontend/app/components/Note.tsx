import React, { useEffect, useRef, useState } from "react";
import NoteListItem from "./NoteListItem";
import Editor from "./Editor";
import NoteStats from "./NoteStats";
import NoteControls from "./NoteControls";
import useGoToNote from "../hooks/useGoToNote";
import SearchInput from "./SearchInput";
import {
  useNavigate,
} from "react-router-dom";
import useConfirmDiscardingUnsavedChangesDialog
  from "../hooks/useConfirmDiscardingUnsavedChangesDialog";
import {
  getAppPath,
  getFileFromUserSelection,
  insertDocumentTitles,
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
import { FILE_PICKER_ACCEPT_TYPES } from "../config";
import { FileInfo } from "../../../lib/notes/interfaces/FileInfo";
import NoteContent from "./NoteContent";
import * as IDB from "idb-keyval";
import { ContentMode } from "../interfaces/ContentMode";
import useKeyboardShortcuts from "../hooks/useKeyboardShortcuts";

interface NoteComponentProps {
  note: ActiveNote,
  setNoteTitle: (title: string) => void,
  setNoteContent: (title: string) => void,
  displayedLinkedNotes: (LinkedNote | FrontendUserNoteChangeNote)[],
  addFileToNoteObject,
  onLinkAddition: (note: MainNoteListItem) => void,
  onLinkRemoval: (noteId: NoteId) => void,
  setUnsavedChanges,
  databaseProvider: DatabaseProvider,
  createNewNote,
  createNewLinkedNote,
  handleNoteSaveRequest,
  removeActiveNote,
  unsavedChanges: boolean,
  pinOrUnpinNote,
  duplicateNote,
  openInGraphView,
}

const DEFAULT_CONTENT_MODE = ContentMode.EDITOR;


const Note = ({
  note,
  setNoteTitle,
  setNoteContent,
  addFileToNoteObject,
  displayedLinkedNotes,
  onLinkAddition,
  onLinkRemoval,
  setUnsavedChanges,
  databaseProvider,
  createNewNote,
  createNewLinkedNote,
  handleNoteSaveRequest,
  removeActiveNote,
  unsavedChanges,
  pinOrUnpinNote,
  duplicateNote,
  openInGraphView,
}: NoteComponentProps) => {
  const goToNote = useGoToNote();
  const [searchString, setSearchString] = useState<string>("");
  const [uploadInProgress, setUploadInProgress] = useState<boolean>(false);
  const [contentMode, setContentMode] = useState<ContentMode>(
    ContentMode.LOADING,
  );
  const [searchResults, setSearchResults] = useState<MainNoteListItem[]>([]);
  const noteTitleElementRef = useRef<HTMLTextAreaElement>(null);
  const navigate = useNavigate();
  const confirmDiscardingUnsavedChanges
    = useConfirmDiscardingUnsavedChangesDialog();

  const handleInvalidCredentialsError = async () => {
    await databaseProvider.removeAccess();
    // setDatabaseMode(DatabaseMode.NONE);
    navigate(getAppPath(PathTemplate.LOGIN));
  };


  const insertFileToNote = (response: FileInfo) => {
    addFileToNoteObject(response);

    // only add line breaks if they're not already there
    let separator;
    if (note.content.endsWith("\n\n")) {
      separator = "";
    } else if (note.content.endsWith("\n")) {
      separator = "\n";
    } else {
      separator = "\n\n";
    }

    setNoteContent(
      `${note.content}${separator}/file:${response.fileId}`,
    );
  };


  const uploadFile = async () => {
    const file = await getFileFromUserSelection(
      FILE_PICKER_ACCEPT_TYPES,
    );

    setUploadInProgress(true);

    const response: FileInfo
      = await databaseProvider.uploadFile(file);

    insertFileToNote(response);

    setUploadInProgress(false);
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


  const toggleEditMode = async () => {
    if (contentMode === ContentMode.LOADING) return;

    const newContentMode = contentMode === ContentMode.EDITOR
      ? ContentMode.VIEWER
      : ContentMode.EDITOR;
    setContentMode(newContentMode);
    await IDB.set("CONTENT_MODE", newContentMode);

    if (newContentMode === ContentMode.EDITOR) {
      document.getElementById("editor")?.focus();
    }

    if (
      newContentMode === ContentMode.VIEWER
      // @ts-ignore calling constructor via instance
      && databaseProvider.constructor.features.includes("GET_DOCUMENT_TITLE")
    ) {
      insertDocumentTitles(note.content, databaseProvider)
        .then((newNoteContent) => {
          if (newNoteContent !== note.content) {
            setNoteContent(newNoteContent);
            setUnsavedChanges(true);
          }
        });
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


  const handleFileDrop = (e) => {
    e.preventDefault();

    if (e.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      [...e.dataTransfer.items].forEach((item) => {
        // If dropped items aren't files, reject them
        if (item.kind === "file") {
          const file = item.getAsFile();
          setUploadInProgress(true);
          databaseProvider.uploadFile(file)
            .then((response) => {
              insertFileToNote(response);
              setUploadInProgress(false);
            });
        }
      });
    } else {
      // Use DataTransfer interface to access the file(s)
      [...e.dataTransfer.files].forEach((file) => {
        databaseProvider.uploadFile(file)
          .then((response) => {
            insertFileToNote(response);
            setUploadInProgress(false);
          });
      });
    }
  };


  useEffect(() => {
    if (noteTitleElementRef.current === null) return;
    const TOTAL_VERTICAL_PADDING = 10;

    noteTitleElementRef.current.style.height = "0px";
    noteTitleElementRef.current.style.height
      = (noteTitleElementRef.current.scrollHeight - TOTAL_VERTICAL_PADDING)
      + "px";
  }, [note.title, contentMode]);


  useEffect(() => {
    IDB.get("CONTENT_MODE")
      .then((value) => {
        let startContentMode;

        if (value === ContentMode.EDITOR) {
          startContentMode = ContentMode.EDITOR;
        } else if (value === ContentMode.VIEWER) {
          startContentMode = ContentMode.VIEWER;
        } else {
          startContentMode = DEFAULT_CONTENT_MODE;
        }

        setContentMode(startContentMode);

        if (startContentMode === ContentMode.EDITOR) {
          setTimeout(() => {
            document.getElementById("editor")?.focus();
          });
        }
      })
      .catch(() => {
        setContentMode(DEFAULT_CONTENT_MODE);
      });
  }, []);


  useKeyboardShortcuts({
    onCmdDot: () => toggleEditMode(),
  });


  return <>
    <NoteControls
      activeNote={note}
      createNewNote={createNewNote}
      createNewLinkedNote={createNewLinkedNote}
      handleNoteSaveRequest={handleNoteSaveRequest}
      removeActiveNote={removeActiveNote}
      unsavedChanges={unsavedChanges}
      setUnsavedChanges={setUnsavedChanges}
      pinOrUnpinNote={pinOrUnpinNote}
      duplicateNote={duplicateNote}
      openInGraphView={openInGraphView}
      uploadFile={uploadFile}
      contentMode={contentMode}
      toggleEditMode={toggleEditMode}
      uploadInProgress={uploadInProgress}
    />
    <section id="note"
      onDrop={handleFileDrop}
      onDragOver={(e) => {
        // https://stackoverflow.com/a/50233827/3890888
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <div id="note-content"
        className={
          "note-content "
          + (contentMode === ContentMode.EDITOR ? "edit-mode" : "view-mode")
        }
      >
        {
          contentMode === ContentMode.EDITOR
            ? <textarea
              ref={noteTitleElementRef}
              id="note-title-textarea"
              onInput={(e) => {
                const element = e.currentTarget;
                setNoteTitle(element.value);
                setUnsavedChanges(true);
              }}
              value={note.title}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  document.getElementById("editor")?.focus();
                }
              }}
            />
            : <h1 id="note-title">{note.title}</h1>
        }
        {
          contentMode === ContentMode.EDITOR
            ? <Editor
              content={note.content}
              onChange={(val) => setNoteContent(val)}
            />
            : ""
        }
        {
          contentMode === ContentMode.VIEWER
            ? <NoteContent
              note={note}
              databaseProvider={databaseProvider}
              toggleEditMode={toggleEditMode}
            />
            : ""
        }
        {
          contentMode === ContentMode.VIEWER
            ? <hr/>
            : ""
        }
        <div id="links">
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
        </div>
        {
          (!note.isUnsaved)
            ? <NoteStats note={note} databaseProvider={databaseProvider} />
            : null
        }
      </div>
    </section>
  </>;
};

export default Note;
