import React, { useEffect, useRef, useState } from "react";
import Editor from "./Editor";
import NoteStats from "./NoteStats";
import NoteControls from "./NoteControls";
import {
  getFilesFromUserSelection,
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
import { ContentMode } from "../interfaces/ContentMode";
import useKeyboardShortcuts from "../hooks/useKeyboardShortcuts";
import NoteLinks from "./NoteLinks";
import NoteKeyValues from "./NoteKeyValues";
import { l } from "../lib/intl";

interface NoteComponentProps {
  note: ActiveNote,
  setNote,
  setNoteTitle: (title: string) => void,
  setNoteContent: (title: string) => void,
  displayedLinkedNotes: (LinkedNote | FrontendUserNoteChangeNote)[],
  addFilesToNoteObject,
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
  contentMode,
  toggleEditMode,
}


const Note = ({
  note,
  setNote,
  setNoteTitle,
  setNoteContent,
  addFilesToNoteObject,
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
  contentMode,
  toggleEditMode,
}: NoteComponentProps) => {
  const [uploadInProgress, setUploadInProgress] = useState<boolean>(false);
  const noteTitleElementRef = useRef<HTMLTextAreaElement>(null);

  const insertFilesToNote = (responses: FileInfo[]) => {
    addFilesToNoteObject(responses);

    const fileIds = responses.map((response) => response.fileId);
    const fileBlocks = fileIds.map((fileId) => `/file:${fileId}`);

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
      `${note.content}${separator}${fileBlocks.join("\n\n")}`,
    );
  };


  const uploadFiles = async () => {
    const files = await getFilesFromUserSelection(
      FILE_PICKER_ACCEPT_TYPES,
    );

    setUploadInProgress(true);

    const responses: FileInfo[]
      = await Promise.all(
        files.map(
          (file) => {
            return databaseProvider.uploadFile(file);
          },
        ),
      );

    insertFilesToNote(responses);

    setUploadInProgress(false);
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
              insertFilesToNote([response]);
              setUploadInProgress(false);
            });
        }
      });
    } else {
      // Use DataTransfer interface to access the file(s)
      [...e.dataTransfer.files].forEach((file) => {
        databaseProvider.uploadFile(file)
          .then((response) => {
            insertFilesToNote([response]);
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
      uploadFiles={uploadFiles}
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
            : <h1 id="note-title">{
              note.title.trim().length > 0
                ? note.title
                : l("list.untitled-note")
            }</h1>
        }
        {
          contentMode === ContentMode.EDITOR
            ? <Editor
              content={note.content}
              onChange={(val) => {
                setNoteContent(val);
                setUnsavedChanges(true);
              }}
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
