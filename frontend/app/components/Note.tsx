import React, { useEffect, useRef, useState } from "react";
import Editor from "./Editor";
import NoteStats from "./NoteStats";
import {
  getFilesFromUserSelection,
} from "../lib/utils";
import ActiveNote from "../types/ActiveNote";
import LinkedNote from "../../../lib/notes/interfaces/LinkedNote";
import {
  FrontendUserNoteChangeNote,
} from "../types/FrontendUserNoteChange";
import { NoteId } from "../../../lib/notes/interfaces/NoteId";
import {
  MainNoteListItem,
} from "../types/NoteListItem";
import DatabaseProvider from "../types/DatabaseProvider";
import { FILE_PICKER_ACCEPT_TYPES } from "../config";
import { FileInfo } from "../../../lib/notes/interfaces/FileInfo";
import NoteContent from "./NoteContent";
import { ContentMode } from "../types/ContentMode";
import useKeyboardShortcuts from "../hooks/useKeyboardShortcuts";
import NoteLinks from "./NoteLinks";
import NoteKeyValues from "./NoteKeyValues";
import { l } from "../lib/intl";
import { GraphId } from "../../../lib/notes/interfaces/GraphId";
import useDatabaseProvider from "../hooks/useDatabaseProvider";
import NoteMenuBar from "./NoteMenuBar";
import NoteActions from "./NoteActions";
import BusyIndicator from "./BusyIndicator";

interface NoteComponentProps {
  isBusy: boolean,
  note: ActiveNote,
  setNote,
  setNoteTitle: (title: string) => void,
  setNoteContent: (title: string) => void,
  displayedLinkedNotes: (LinkedNote | FrontendUserNoteChangeNote)[],
  addFilesToNoteObject,
  onLinkAddition: (note: MainNoteListItem) => void,
  onLinkRemoval: (noteId: NoteId) => void,
  setUnsavedChanges,
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
  importNote,
  graphId: GraphId,
}


const Note = ({
  isBusy,
  note,
  setNote,
  setNoteTitle,
  setNoteContent,
  addFilesToNoteObject,
  displayedLinkedNotes,
  onLinkAddition,
  onLinkRemoval,
  setUnsavedChanges,
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
  importNote,
  graphId,
}: NoteComponentProps) => {
  const databaseProvider = useDatabaseProvider();
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


  const uploadFiles = async (
    databaseProvider: DatabaseProvider,
    files: File[],
  ) => {
    setUploadInProgress(true);

    const responses: FileInfo[]
      = await Promise.all(
        files.map(
          (file) => {
            return databaseProvider.uploadFile(graphId, file);
          },
        ),
      );

    insertFilesToNote(responses);

    setUploadInProgress(false);
  };


  const handleUploadFilesRequest = async () => {
    if (!databaseProvider) throw new Error("DatabaseProvider not ready");
    const files = await getFilesFromUserSelection(
      FILE_PICKER_ACCEPT_TYPES,
      true,
    );

    return uploadFiles(databaseProvider, files);
  };


  const handleFileDrop = (e) => {
    e.preventDefault();

    if (e.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      const files = [...e.dataTransfer.items]
        .filter((item) => {
          // If dropped items aren't files, reject them
          return item.kind === "file";
        })
        .map((item) => {
          return item.getAsFile();
        });

      uploadFiles(databaseProvider, files);
    } else {
      // Use DataTransfer interface to access the file(s)
      const files = [...e.dataTransfer.files];
      uploadFiles(databaseProvider, files);
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
    <NoteMenuBar
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
      handleUploadFilesRequest={handleUploadFilesRequest}
      contentMode={contentMode}
      toggleEditMode={toggleEditMode}
      uploadInProgress={uploadInProgress}
      importNote={importNote}
      graphId={graphId}
    />
    {
      isBusy
        ? <div className="note-busy-container">
          <BusyIndicator alt={l("app.loading")} height={64} />
        </div>
        : <section className="note"
          onDrop={handleFileDrop}
          onPaste={(e) => {
            if (!databaseProvider) return;

            const files = Array.from(e.clipboardData.files);
            if (files.length > 0) {
              uploadFiles(databaseProvider, files);
              e.preventDefault();
            }
          }}
          onDragOver={(e) => {
            // https://stackoverflow.com/a/50233827/3890888
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <div
            className={
              "note-content "
              + (contentMode === ContentMode.EDITOR ? "edit-mode" : "view-mode")
            }
          >
            {
              contentMode === ContentMode.EDITOR
                ? <textarea
                  ref={noteTitleElementRef}
                  className="note-title"
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
                : <h1 className="note-title">{
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
                  }}
                />
                : ""
            }
            {
              contentMode === ContentMode.VIEWER
                ? <NoteContent
                  note={note}
                  toggleEditMode={toggleEditMode}
                  graphId={graphId}
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
              unsavedChanges={unsavedChanges}
              graphId={graphId}
            />
            <NoteKeyValues
              note={note}
              setNote={setNote}
              setUnsavedChanges={setUnsavedChanges}
            />
            {
              (!note.isUnsaved)
                ? <NoteStats
                  note={note}
                  graphId={graphId}
                />
                : null
            }
            <NoteActions
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
              handleUploadFilesRequest={handleUploadFilesRequest}
              contentMode={contentMode}
              toggleEditMode={toggleEditMode}
              importNote={importNote}
              graphId={graphId}
            />
          </div>
        </section>
    }
  </>;
};

export default Note;
