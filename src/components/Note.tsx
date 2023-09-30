import {
  DragEvent,
  DragEventHandler,
  ReactElement,
  useEffect,
  useRef,
} from "react";
import { Editor } from "../lib/editor";
import NoteStats from "./NoteStats";
import {
  getAppPath,
  getFilesFromUserSelection,
} from "../lib/utils";
import ActiveNote from "../types/ActiveNote";
import { FILE_PICKER_ACCEPT_TYPES, LOCAL_GRAPH_ID } from "../config";
import { FileInfo } from "../lib/notes/interfaces/FileInfo";
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
import {
  getMediaTypeFromFilename,
  getNoteTitle,
  isFileSlug,
  sluggify,
} from "../lib/notes/noteUtils";
import { MediaType } from "../lib/notes/interfaces/MediaType";
import NoteContentBlockAudio from "./NoteContentBlockAudio";
import NoteContentBlockVideo from "./NoteContentBlockVideo";
import NoteContentBlockDocument from "./NoteContentBlockDocument";
import NoteContentBlockTextFile from "./NoteContentBlockTextFile";
import NoteContentBlockImage from "./NoteContentBlockImage";
import NotesProvider from "../lib/notes";
import { getNoteTransclusionContent } from "../lib/Transclusion";
import { LinkType } from "../types/LinkType";
import { UserRequestType } from "../lib/editor/types/UserRequestType";
import NoteSlug from "./NoteSlug";

interface NoteComponentProps {
  isBusy: boolean,
  note: ActiveNote,
  editorInstanceId: number,
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
  importNote: (note: ActiveNote) => void,
  uploadInProgress: boolean,
  setUploadInProgress: (val: boolean) => void,
  updateReferences: boolean,
  setUpdateReferences: (val: boolean) => void,
  insertModule: { insert?: (text: string) => void },
  onLinkIndicatorClick: (slug: Slug, title: string) => void,
}


const Note = ({
  isBusy,
  note,
  editorInstanceId,
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
  importNote,
  uploadInProgress,
  setUploadInProgress,
  updateReferences,
  setUpdateReferences,
  insertModule,
  onLinkIndicatorClick,
}: NoteComponentProps) => {
  const noteElement = useRef<HTMLElement>(null);
  const notesProvider = useNotesProvider();
  const goToNote = useGoToNote();
  const confirmDiscardingUnsavedChanges
    = useConfirmDiscardingUnsavedChangesDialog();
  const navigate = useNavigate();

  const insertFileSlugsToNote = (fileInfos: FileInfo[]) => {
    addFilesToNoteObject(fileInfos);

    const fileSlugs = fileInfos.map((fileInfo) => fileInfo.slug);
    const slashlinks = fileSlugs.map((slug) => `/${slug}`);

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
      `${note.content}${separator}${slashlinks.join("\n")}`,
      true,
    );
  };


  const uploadFiles = async (
    notesProvider: NotesProvider,
    files: File[],
  ) => {
    setUploadInProgress(true);

    const responses: FileInfo[]
      = await Promise.all(
        files.map(
          (file) => {
            return notesProvider.addFile(
              file.stream(),
              file.name,
            );
          },
        ),
      );

    insertFileSlugsToNote(responses);

    setUploadInProgress(false);
  };


  const handleUploadFilesRequest = async () => {
    if (!notesProvider) throw new Error("NotesProvider not ready");
    const files = await getFilesFromUserSelection(
      FILE_PICKER_ACCEPT_TYPES,
      true,
    );

    return uploadFiles(notesProvider, files);
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

      uploadFiles(notesProvider, files);
    } else {
      // Use DataTransfer interface to access the file(s)
      const files = [...e.dataTransfer.files];
      uploadFiles(notesProvider, files);
    }
  };


  // This ref is required because the callback to getTransclusionContent()
  // is not updated inside the <Editor> component when the note changes.
  const noteRef = useRef<ActiveNote>(note);
  noteRef.current = note;

  const getTransclusionContent = async (slug: Slug): Promise<ReactElement> => {
    const note = noteRef.current;

    if (!slug) {
      throw new Error("INVALID_FILE_SLUG");
    }

    if (isFileSlug(slug)) {
      const availableFileInfos = [
        ...note.files,
      ];

      const mediaType = getMediaTypeFromFilename(slug);
      let file = availableFileInfos.find((file) => file.slug === slug);

      if (!file) {
        file = await notesProvider.getFileInfo(slug);
      }

      if (
        mediaType === MediaType.AUDIO
      ) {
        return <NoteContentBlockAudio
          file={file}
          notesProvider={notesProvider}
          key={file.slug}
        />;
      } else if (mediaType === MediaType.VIDEO) {
        return <NoteContentBlockVideo
          file={file}
          notesProvider={notesProvider}
          key={file.slug}
        />;
      } else if (mediaType === MediaType.IMAGE) {
        return <NoteContentBlockImage
          file={file}
          notesProvider={notesProvider}
          key={file.slug}
        />;
      } else if (mediaType === MediaType.TEXT) {
        return <NoteContentBlockTextFile
          file={file}
          notesProvider={notesProvider}
          key={file.slug}
        />;
      } else {
        return <NoteContentBlockDocument
          file={file}
          key={file.slug}
        />;
      }
    }

    if ("outgoingLinks" in note) {
      const linkedNote = note.outgoingLinks.find(
        (link) => link.slug === slug,
      );

      if (linkedNote) {
        return getNoteTransclusionContent(linkedNote.content, linkedNote.title);
      }
    }

    const linkedNote = await notesProvider.get(slug);
    return getNoteTransclusionContent(
      linkedNote.content,
      getNoteTitle(linkedNote),
    );
  };


  const getLinkAvailability = async (
    linkText: string,
    linkType: LinkType,
  ): Promise<boolean> => {
    const slug = linkType === LinkType.WIKILINK
      ? sluggify(linkText)
      : linkText;

    if (isFileSlug(slug)) {
      try {
        await notesProvider.getFileInfo(slug);
        return true;
      } catch (e) {
        return false;
      }
    }

    try {
      await notesProvider.get(slug);
      return true;
    } catch (e) {
      return false;
    }
  };

  useEffect(() => {
    if (noteElement.current) {
      noteElement.current.scrollTop = 0;
    }
  }, ["slug" in note ? note.slug : ""]);


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
      handleUploadFilesRequest={handleUploadFilesRequest}
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
            if (!notesProvider) return;

            const files = Array.from(e.clipboardData.files);
            if (files.length > 0) {
              uploadFiles(notesProvider, files);
              e.preventDefault();
            }
          }}
          onDragOver={(e) => {
            // https://stackoverflow.com/a/50233827/3890888
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <NoteSlug
            note={note}
            slugInput={slugInput}
            setSlugInput={setSlugInput}
            setUnsavedChanges={setUnsavedChanges}
            updateReferences={updateReferences}
            setUpdateReferences={setUpdateReferences}
          />
          <Editor
            insertModule={insertModule}
            initialText={note.initialContent}
            instanceId={editorInstanceId}
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

                  const slug = type === UserRequestType.WIKILINK
                    ? sluggify(value)
                    : value;

                  if (isFileSlug(slug)) {
                    navigate(
                      getAppPath(PathTemplate.FILE, new Map([
                        ["GRAPH_ID", LOCAL_GRAPH_ID],
                        ["FILE_SLUG", slug],
                      ])),
                    );
                  } else {
                    goToNote(slug);
                  }
                } else {
                  window.open(value, "_blank", "noopener,noreferrer");
                }
              }
            }
            getTransclusionContent={getTransclusionContent}
            getLinkAvailability={getLinkAvailability}
          />
          <div
            className="note-content edit-mode"
          >
            <NoteBacklinks
              note={note}
              setUnsavedChanges={setUnsavedChanges}
              unsavedChanges={unsavedChanges}
              onLinkIndicatorClick={onLinkIndicatorClick}
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
              handleUploadFilesRequest={handleUploadFilesRequest}
              importNote={importNote}
            />
          </div>
        </section>
    }
  </>;
};

export default Note;
