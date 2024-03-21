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
import { InsertItem } from "../types/InsertItem";
import { insertItems } from "../lib/editorManipulations";

interface NoteComponentProps {
  editorInstanceId: number,
  isBusy: boolean,
  note: ActiveNote,
  slugInput: string,
  setSlugInput: (val: string) => void,
  displayedSlugAliases: string[],
  setDisplayedSlugAliases: (val: string[]) => void,
  setNote: (note: ActiveNote) => void,
  handleEditorContentChange: (title: string) => void,
  addFilesToNoteObject: (responses: FileInfo[]) => void,
  setUnsavedChanges: (val: boolean) => void,
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
  handleNoteExportRequest: () => void,
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
  handleEditorContentChange,
  addFilesToNoteObject,
  setUnsavedChanges,
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
  handleNoteExportRequest,
}: NoteComponentProps) => {
  const noteElement = useRef<HTMLElement>(null);
  const notesProvider = useNotesProvider();
  const goToNote = useGoToNote();
  const confirmDiscardingUnsavedChanges
    = useConfirmDiscardingUnsavedChangesDialog();
  const navigate = useNavigate();
  const [editor] = useLexicalComposerContext();

  /*
    Items can be a string or a file, very similar to
    DataTransferItem.kind:
    https://developer.mozilla.org/en-US/docs/Web/API/DataTransferItem/kind
  */
  const insertFilesAndStringsToNote = (fileOrString: (FileInfo | string)[]) => {
    const items: InsertItem[] = fileOrString.map((fos) => {
      if (typeof fos === "string") {
        return {
          type: "string",
          value: fos,
        };
      } else {
        return {
          type: "file-slug",
          value: "/" + fos.slug,
        };
      }
    });

    insertItems(items, editor);
  };


  const uploadFiles = async (
    notesProvider: NotesProvider,
    files: File[],
  ): Promise<FileInfo[]> => {
    setUploadInProgress(true);

    const fileInfos = await Promise.all(
      files.map(
        (file) => {
          return notesProvider.addFile(
            file.stream(),
            file.name,
          );
        },
      ),
    );

    setUploadInProgress(false);
    addFilesToNoteObject(fileInfos);
    return fileInfos;
  };


  const uploadFilesAndInsertFileSlugsToNote = async (
    notesProvider: NotesProvider,
    files: File[],
  ): Promise<void> => {
    const fileInfos = await uploadFiles(notesProvider, files);
    insertFilesAndStringsToNote(fileInfos);
  };


  const handleUploadFilesRequest = async () => {
    if (!notesProvider) throw new Error("NotesProvider not ready");
    const files = await getFilesFromUserSelection(
      FILE_PICKER_ACCEPT_TYPES,
      true,
    );

    return uploadFilesAndInsertFileSlugsToNote(notesProvider, files);
  };


  const handleDrop: DragEventHandler = async (
    e: DragEvent<HTMLElement>,
  ): Promise<void> => {
    e.preventDefault();
    const promisesToWaitFor: Promise<FileInfo | string>[] = [];

    [...e.dataTransfer.items]
      .forEach((item: DataTransferItem): void => {
        if (item.kind === "file") {
          const file = item.getAsFile();
          if (file) {
            setUploadInProgress(true);
            const fileUploadPromise = notesProvider.addFile(
              file.stream(),
              file.name,
            );
            promisesToWaitFor.push(fileUploadPromise);
          }
        } else {
          const stringTransformPromise = new Promise<string>((resolve) => {
            item.getAsString((val) => {
              resolve(val);
            });
          });

          promisesToWaitFor.push(stringTransformPromise);
        }
      });

    const items = await Promise.all(promisesToWaitFor);
    setUploadInProgress(false);
    insertFilesAndStringsToNote(items);
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
      handleNoteSaveRequest={handleNoteSaveRequest}
      removeActiveNote={removeActiveNote}
      unsavedChanges={unsavedChanges}
      setUnsavedChanges={setUnsavedChanges}
      pinOrUnpinNote={pinOrUnpinNote}
      duplicateNote={duplicateNote}
      handleUploadFilesRequest={handleUploadFilesRequest}
      uploadInProgress={uploadInProgress}
      importNote={importNote}
      handleNoteExportRequest={handleNoteExportRequest}
    />
    {
      isBusy
        ? <div className="note-busy-container">
          <BusyIndicator alt={l("app.loading")} height={64} />
        </div>
        : <section
          className="note"
          ref={noteElement}
          onDrop={handleDrop}
          onPaste={(e) => {
            if (!notesProvider) return;

            const files = Array.from(e.clipboardData.files);
            if (files.length > 0) {
              uploadFilesAndInsertFileSlugsToNote(notesProvider, files);
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
              handleEditorContentChange(val);
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
                    goToNote(slug, {
                      contentIfNewNote: type === UserRequestType.WIKILINK
                        ? value
                        : "",
                    });
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
