import {
  DragEvent,
  DragEventHandler,
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
import { FileInfo } from "../lib/notes/types/FileInfo";
import NoteKeyValues from "./NoteKeyValues";
import { l } from "../lib/intl";
import useNotesProvider from "../hooks/useNotesProvider";
import NoteMenuBar from "./NoteMenuBar";
import BusyIndicator from "./BusyIndicator";
import NoteBacklinks from "./NoteBacklinks";
import { Slug } from "../lib/notes/types/Slug";
import CreateNewNoteParams from "../types/CreateNewNoteParams";
import NotesProvider from "../lib/notes";
import NoteSlug from "./NoteSlug";
import { UserRequestType } from "../lib/editor/types/UserRequestType";
import useConfirmDiscardingUnsavedChangesDialog
  from "../hooks/useConfirmDiscardingUnsavedChangesDialog";
import { isFileSlug, sluggify } from "../lib/notes/slugUtils";
import { LinkType } from "../types/LinkType";
import useGoToNote from "../hooks/useGoToNote";
import { getTransclusionContent } from "../lib/Transclusion";
import { PathTemplate } from "../types/PathTemplate";
import { useNavigate } from "react-router-dom";
import {
  useLexicalComposerContext,
} from "@lexical/react/LexicalComposerContext";
import { insertFileSlugs } from "../lib/editorManipulations";

interface NoteComponentProps {
  editorInstanceId: number,
  isBusy: boolean,
  note: ActiveNote,
  slugInput: string,
  setSlugInput: (val: string) => void,
  displayedSlugAliases: string[],
  setDisplayedSlugAliases: (val: string[]) => void,
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
  duplicateNote: () => void,
  importNote: () => void,
  uploadInProgress: boolean,
  setUploadInProgress: (val: boolean) => void,
  updateReferences: boolean,
  setUpdateReferences: (val: boolean) => void,
  onLinkIndicatorClick: (slug: Slug, title: string) => void,
}


const Note = ({
  editorInstanceId,
  isBusy,
  note,
  setNote,
  slugInput,
  setSlugInput,
  displayedSlugAliases,
  setDisplayedSlugAliases,
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
  onLinkIndicatorClick,
}: NoteComponentProps) => {
  const noteElement = useRef<HTMLElement>(null);
  const notesProvider = useNotesProvider();
  const goToNote = useGoToNote();
  const confirmDiscardingUnsavedChanges
    = useConfirmDiscardingUnsavedChangesDialog();
  const navigate = useNavigate();
  const [editor] = useLexicalComposerContext();

  const insertFileSlugsToNote = (fileInfos: FileInfo[]) => {
    addFilesToNoteObject(fileInfos);
    const fileSlugs = fileInfos.map((fileInfo) => fileInfo.slug);
    insertFileSlugs(fileSlugs, editor);
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
      disableNoteSaving={!NotesProvider.isValidSlugOrEmpty(slugInput)}
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
            displayedSlugAliases={displayedSlugAliases}
            setDisplayedSlugAliases={setDisplayedSlugAliases}
            setUnsavedChanges={setUnsavedChanges}
            updateReferences={updateReferences}
            setUpdateReferences={setUpdateReferences}
          />
          <Editor
            initialText={note.initialContent}
            instanceId={editorInstanceId}
            onChange={(val: string) => {
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
            getTransclusionContent={(slug: Slug) => {
              return getTransclusionContent(slug, note, notesProvider);
            }}
            getLinkAvailability={getLinkAvailability}
          />
          <div
            className="note-content"
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
          </div>
        </section>
    }
  </>;
};

export default Note;
