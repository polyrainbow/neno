import {
  DragEvent,
  DragEventHandler,
  ReactElement,
  useEffect,
  useRef,
} from "react";
import { Editor, UserRequestType } from "../lib/editor";
import NoteStats from "./NoteStats";
import {
  getAppPath,
  getFileId,
  getFilesFromUserSelection,
  getFirstLines,
} from "../lib/utils";
import ActiveNote from "../types/ActiveNote";
import { FILE_PICKER_ACCEPT_TYPES, LOCAL_GRAPH_ID } from "../config";
import { FileInfo } from "../lib/notes/interfaces/FileInfo";
import NoteContent from "./NoteContent";
import { ContentMode } from "../types/ContentMode";
import useKeyboardShortcuts from "../hooks/useKeyboardShortcuts";
import NoteKeyValues from "./NoteKeyValues";
import { l } from "../lib/intl";
import useNotesProvider from "../hooks/useNotesProvider";
import NoteMenuBar from "./NoteMenuBar";
import NoteActions from "./NoteActions";
import BusyIndicator from "./BusyIndicator";
import NoteBacklinks from "./NoteBacklinks";
import { Slug } from "../lib/notes/interfaces/Slug";
import useGoToNote from "../hooks/useGoToNote";
import useConfirmDiscardingUnsavedChangesDialog
  from "../hooks/useConfirmDiscardingUnsavedChangesDialog";
import { useNavigate } from "react-router-dom";
import { PathTemplate } from "../enum/PathTemplate";
import CreateNewNoteParams from "../types/CreateNewNoteParams";
import NoteContentBlockEmptyFile from "./NoteContentBlockEmptyFile";
import { getMediaTypeFromFilename, sluggifyLink } from "../lib/notes/noteUtils";
import { MediaType } from "../lib/notes/interfaces/MediaType";
import NoteContentBlockAudio from "./NoteContentBlockAudio";
import NoteContentBlockVideo from "./NoteContentBlockVideo";
import NoteContentBlockDocument from "./NoteContentBlockDocument";
import NoteContentBlockTextFile from "./NoteContentBlockTextFile";
import NoteContentBlockImage from "./NoteContentBlockImage";
import { FILE_SLUG_PREFIX } from "../lib/notes/config";
import NotesProvider from "../lib/notes";

interface NoteComponentProps {
  isBusy: boolean,
  note: ActiveNote,
  slugInput: string,
  setSlugInput: (val: string) => void,
  setNote: (note: ActiveNote) => void,
  setNoteContent: (title: string, refreshEditor?: boolean) => void,
  addFilesToNoteObject: (responses: FileInfo[]) => void,
  setUnsavedChanges: (val: boolean) => void,
  createNewNote: (params: CreateNewNoteParams) => void,
  createNewLinkedNote: () => void,
  handleNoteSaveRequest: () => void,
  removeActiveNote: () => void,
  unsavedChanges: boolean,
  pinOrUnpinNote: (slug: Slug) => void,
  duplicateNote: (note: ActiveNote) => void,
  openInGraphView: (note: ActiveNote) => void,
  contentMode: ContentMode,
  toggleEditMode: () => void,
  importNote: (note: ActiveNote) => void,
  uploadInProgress: boolean,
  setUploadInProgress: (val: boolean) => void,
}


const getTransclusionContentFromNoteContent = async (
  noteContent: string,
): Promise<ReactElement> => {
  const MAX_LINES = 6;

  const lines = noteContent.split("\n");
  let transclusionContent;

  if (lines.length <= MAX_LINES) {
    transclusionContent = noteContent;
  } else {
    transclusionContent = getFirstLines(noteContent, MAX_LINES) + "\n…";
  }

  return <p className="transclusion-note-content">
    {transclusionContent}
  </p>;
};


const Note = ({
  isBusy,
  note,
  setNote,
  slugInput,
  setSlugInput,
  setNoteContent,
  addFilesToNoteObject,
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
  uploadInProgress,
  setUploadInProgress,
}: NoteComponentProps) => {
  const noteElement = useRef<HTMLElement>(null);
  const databaseProvider = useNotesProvider();
  const goToNote = useGoToNote();
  const confirmDiscardingUnsavedChanges
    = useConfirmDiscardingUnsavedChangesDialog();
  const navigate = useNavigate();

  const insertFilesToNote = (responses: FileInfo[]) => {
    addFilesToNoteObject(responses);

    const fileIds = responses.map((response) => response.fileId);
    const fileBlocks = fileIds.map((fileId) => `/files/${fileId}`);

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
      `${note.content}${separator}${fileBlocks.join("\n")}`,
      true,
    );
  };


  const uploadFiles = async (
    databaseProvider: NotesProvider,
    files: File[],
  ) => {
    setUploadInProgress(true);

    const responses: FileInfo[]
      = await Promise.all(
        files.map(
          (file) => {
            return databaseProvider.addFile(
              file.stream(),
              file.name,
            );
          },
        ),
      );

    insertFilesToNote(responses);

    setUploadInProgress(false);
  };


  const handleUploadFilesRequest = async () => {
    if (!databaseProvider) throw new Error("NotesProvider not ready");
    const files = await getFilesFromUserSelection(
      FILE_PICKER_ACCEPT_TYPES,
      true,
    );

    return uploadFiles(databaseProvider, files);
  };


  const handleFileDrop: DragEventHandler = (e: DragEvent<HTMLElement>) => {
    e.preventDefault();

    if (!e.dataTransfer) return;

    if (e.dataTransfer.items) {
      // Use DataTransferItemList interface to access the file(s)
      const files = [...e.dataTransfer.items]
        .filter((item: DataTransferItem): boolean => {
          // If dropped items aren't files, reject them
          return item.kind === "file";
        })
        .map((item: DataTransferItem): File | null => {
          return item.getAsFile();
        })
        .filter((file: File | null): file is File => file !== null);

      uploadFiles(databaseProvider, files);
    } else {
      // Use DataTransfer interface to access the file(s)
      const files = [...e.dataTransfer.files];
      uploadFiles(databaseProvider, files);
    }
  };


  useKeyboardShortcuts({
    onCmdDot: () => toggleEditMode(),
  });

  // This ref is required because the callback to getTransclusionContent()
  // is not updated inside the <Editor> component when the note changes.
  const noteRef = useRef<ActiveNote>(note);
  noteRef.current = note;

  const getTransclusionContent = async (slug: Slug): Promise<ReactElement> => {
    const note = noteRef.current;

    if (slug.startsWith(FILE_SLUG_PREFIX)) {
      const availableFileInfos = [
        ...note.files,
      ];

      const fileId = getFileId(slug);
      if (!fileId) {
        return <NoteContentBlockEmptyFile
          key={Math.random()}
        />;
      }

      const mediaType = getMediaTypeFromFilename(fileId);
      let file = availableFileInfos.find((file) => file.fileId === fileId);

      if (!file) {
        try {
          file = await databaseProvider.getFileInfo(fileId);
        } catch (e) {
          return <NoteContentBlockEmptyFile
            key={Math.random()}
          />;
        }
      }

      if (
        mediaType === MediaType.AUDIO
      ) {
        return <NoteContentBlockAudio
          file={file}
          databaseProvider={databaseProvider}
          key={file.fileId}
        />;
      } else if (mediaType === MediaType.VIDEO) {
        return <NoteContentBlockVideo
          file={file}
          databaseProvider={databaseProvider}
          key={file.fileId}
        />;
      } else if (mediaType === MediaType.IMAGE) {
        return <NoteContentBlockImage
          file={file}
          databaseProvider={databaseProvider}
          key={file.fileId}
          description={""}
        />;
      } else if (mediaType === MediaType.TEXT) {
        return <NoteContentBlockTextFile
          file={file}
          databaseProvider={databaseProvider}
          key={file.fileId}
        />;
      } else {
        return <NoteContentBlockDocument
          file={file}
          key={file.fileId}
        />;
      }
    }

    if ("outgoingLinks" in note) {
      const linkedNote = note.outgoingLinks.find(
        (link) => link.slug === slug,
      );

      if (linkedNote) {
        return getTransclusionContentFromNoteContent(linkedNote.content);
      }
    }

    try {
      const linkedNote = await databaseProvider.get(slug);
      return getTransclusionContentFromNoteContent(linkedNote.content);
    } catch (e) {
      return <p>Transclusion not available.</p>;
    }
  };


  useEffect(() => {
    if (noteElement.current) {
      noteElement.current.scrollTop = 0;
    }
  }, ["slug" in note ? note.slug : "", contentMode]);


  return <>
    <NoteMenuBar
      activeNote={note}
      disableNoteSaving={
        !NotesProvider.isValidSlug(slugInput) && slugInput !== ""
      }
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
    />
    {
      isBusy
        ? <div className="note-busy-container">
          <BusyIndicator alt={l("app.loading")} height={64} />
        </div>
        : <section
          className="note"
          ref={noteElement}
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
          <div className="slug-line">
            <input
              type="text"
              placeholder="slug"
              className={
                "note-slug "
                + (
                  !NotesProvider.isValidSlug(slugInput) && slugInput.length > 0
                    ? "invalid"
                    : ""
                )
              }
              onInput={(e) => {
                const element = e.currentTarget;
                const newValue = element.value.replace(/[^\w\d-/._]/g, "");
                setSlugInput(newValue);
                setUnsavedChanges(true);
              }}
              value={slugInput}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  document.getElementById("editor")?.focus();
                }

                if (e.key === "Escape") {
                  e.preventDefault();
                  setSlugInput("slug" in note ? note.slug : "");
                }
              }}
            />
            {
              slugInput.length > 0 && !NotesProvider.isValidSlug(slugInput)
                ? <div className="note-slug-validation-error">
                  INVALID SLUG
                </div>
                : ""
            }
          </div>
          {
            contentMode === ContentMode.EDITOR
              ? <Editor
                initialText={note.initialContent}
                onChange={(val) => {
                  setNoteContent(val);
                }}
                onUserRequest={
                  async (type: UserRequestType, value: string) => {
                    if (type !== UserRequestType.HYPERLINK) {
                      if (unsavedChanges) {
                        await confirmDiscardingUnsavedChanges();
                        setUnsavedChanges(false);
                      }

                      const slug = sluggifyLink(value);

                      if (slug.startsWith(FILE_SLUG_PREFIX)) {
                        const fileId = getFileId(slug);

                        if (!fileId) {
                          return;
                        }

                        navigate(
                          getAppPath(PathTemplate.FILE, new Map([
                            ["GRAPH_ID", LOCAL_GRAPH_ID],
                            ["FILE_ID", fileId],
                          ])),
                        );
                      } else {
                        goToNote(slug);
                      }
                    } else {
                      window.open(value, "_blank");
                    }
                  }
                }
                getTransclusionContent={getTransclusionContent}
              />
              : ""
          }
          {
            contentMode === ContentMode.VIEWER
              ? <NoteContent
                note={note}
                toggleEditMode={toggleEditMode}
              />
              : ""
          }
          <div
            className={
              "note-content "
              + (contentMode === ContentMode.EDITOR ? "edit-mode" : "view-mode")
            }
          >
            {
              contentMode === ContentMode.VIEWER
                ? <hr/>
                : ""
            }
            <NoteBacklinks
              note={note}
              setUnsavedChanges={setUnsavedChanges}
              unsavedChanges={unsavedChanges}
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
            />
          </div>
        </section>
    }
  </>;
};

export default Note;
