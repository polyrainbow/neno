import React, { useEffect, useRef, useState } from "react";
import Editor from "./Editor";
import NoteStats from "./NoteStats";
import NoteControls from "./NoteControls";
import {
  getFileFromUserSelection,
  insertDocumentTitles,
} from "../lib/utils";
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
import { FILE_PICKER_ACCEPT_TYPES } from "../config";
import { FileInfo } from "../../../lib/notes/interfaces/FileInfo";
import NoteContent from "./NoteContent";
import * as IDB from "idb-keyval";
import { ContentMode } from "../interfaces/ContentMode";
import useKeyboardShortcuts from "../hooks/useKeyboardShortcuts";
import NoteLinks from "./NoteLinks";
import NoteKeyValues from "./NoteKeyValues";

interface NoteComponentProps {
  note: ActiveNote,
  setNote,
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
  setNote,
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
  const [uploadInProgress, setUploadInProgress] = useState<boolean>(false);
  const [contentMode, setContentMode] = useState<ContentMode>(
    ContentMode.LOADING,
  );
  const noteTitleElementRef = useRef<HTMLTextAreaElement>(null);

  const insertFileToNote = (response: FileInfo) => {
    addFileToNoteObject(response);

    // only add line breaks if they're not already there
    let separator;
    if (note.content.endsWith("\n\n") || note.content.length === 0) {
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
        <NoteLinks
          note={note}
          displayedLinkedNotes={displayedLinkedNotes}
          onLinkAddition={onLinkAddition}
          onLinkRemoval={onLinkRemoval}
          setUnsavedChanges={setUnsavedChanges}
          databaseProvider={databaseProvider}
          unsavedChanges={unsavedChanges}
        />
        <NoteKeyValues
          note={note}
          setNote={setNote}
        />
        {
          (!note.isUnsaved)
            ? <NoteStats note={note} />
            : null
        }
      </div>
    </section>
  </>;
};

export default Note;
