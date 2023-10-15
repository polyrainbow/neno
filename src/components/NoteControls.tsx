import IconButton from "./IconButton";
import { useNavigate } from "react-router-dom";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import useConfirmDiscardingUnsavedChangesDialog
  from "../hooks/useConfirmDiscardingUnsavedChangesDialog";
import {
  getAppPath,
} from "../lib/utils";
import { PathTemplate } from "../types/PathTemplate";
import { l } from "../lib/intl";
import ActiveNote from "../types/ActiveNote";
import useNotesProvider from "../hooks/useNotesProvider";
import { exportNote } from "../lib/FrontendFunctions";
import { Slug } from "../lib/notes/types/Slug";
import CreateNewNoteParams from "../types/CreateNewNoteParams";
import { LOCAL_GRAPH_ID } from "../config";
import useConfirm from "../hooks/useConfirm";

interface NoteControlsProps {
  activeNote: ActiveNote,
  createNewNote: (params: CreateNewNoteParams) => void,
  createNewLinkedNote: () => void,
  handleNoteSaveRequest: () => void,
  removeActiveNote: () => void,
  unsavedChanges: boolean,
  setUnsavedChanges: (val: boolean) => void,
  pinOrUnpinNote: (slug: Slug) => void,
  duplicateNote: (note: ActiveNote) => void,
  handleUploadFilesRequest: (files: FileList) => void,
  importNote: (note: ActiveNote) => void,
  disableNoteSaving: boolean,
}

const NoteControls = ({
  activeNote,
  createNewNote,
  createNewLinkedNote,
  handleNoteSaveRequest,
  removeActiveNote,
  unsavedChanges,
  setUnsavedChanges,
  pinOrUnpinNote,
  duplicateNote,
  handleUploadFilesRequest,
  importNote,
  disableNoteSaving,
}: NoteControlsProps) => {
  const notesProvider = useNotesProvider();
  const confirmDiscardingUnsavedChanges
    = useConfirmDiscardingUnsavedChangesDialog();
  const navigate = useNavigate();
  const isSmallScreen = useIsSmallScreen();
  const confirm = useConfirm();


  return <>
    {
      isSmallScreen
        ? <IconButton
          id="button_list"
          title={l("editor.go-to-list")}
          icon="list"
          onClick={async () => {
            if (unsavedChanges) {
              await confirmDiscardingUnsavedChanges();
              setUnsavedChanges(false);
            }
            navigate(getAppPath(
              PathTemplate.LIST,
              new Map([["GRAPH_ID", LOCAL_GRAPH_ID]]),
            ));
          }}
        />
        : null
    }
    {
      !isSmallScreen
        ? <>
          <IconButton
            id="button_new"
            title={l("editor.new-note")}
            icon="add"
            onClick={() => createNewNote({})}
          />
          <IconButton
            id="button_create-linked-note"
            disabled={activeNote.isUnsaved}
            title={l("editor.create-linked-note")}
            icon="add_circle"
            onClick={() => createNewLinkedNote()}
          />
        </>
        : null
    }
    <IconButton
      id="button_upload"
      title={l("editor.save-note")}
      icon="save"
      disabled={disableNoteSaving}
      onClick={handleNoteSaveRequest}
    />
    {
      !isSmallScreen
        ? <>
          <IconButton
            id="button_remove"
            disabled={activeNote.isUnsaved}
            title={l("editor.remove-note")}
            icon={"delete"}
            onClick={async () => {
              await confirm({
                text: l("editor.remove-note.confirm.text"),
                confirmText: l("editor.remove-note.confirm.confirm"),
                cancelText: l("dialog.cancel"),
                encourageConfirmation: false,
              });

              removeActiveNote();
            }}
          />
          <IconButton
            id="button_duplicate"
            disabled={activeNote.isUnsaved}
            title={l("editor.duplicate-note")}
            icon="content_copy"
            onClick={duplicateNote}
          />
          <IconButton
            id="button_pin"
            disabled={activeNote.isUnsaved}
            title={l("editor.pin-note")}
            icon="push_pin"
            onClick={() => {
              if (activeNote.isUnsaved) return;
              pinOrUnpinNote(activeNote.slug);
            }}
          />
          <IconButton
            id="button_import-note"
            disabled={!activeNote.isUnsaved}
            title={l("editor.import-note")}
            icon="file_upload"
            onClick={importNote}
          />
          <IconButton
            id="button_export-note"
            disabled={false}
            title={l("editor.export-note")}
            icon="file_download"
            onClick={() => {
              if (!notesProvider) return;
              exportNote(activeNote, notesProvider);
            }}
          />
          <IconButton
            id="button_upload-file"
            disabled={false}
            title={l("editor.upload-file")}
            icon="upload_file"
            onClick={handleUploadFilesRequest}
          />
          <IconButton
            id="button_random-note"
            disabled={false}
            title={l("editor.open-random-note")}
            icon="question_mark"
            onClick={async () => {
              if (unsavedChanges) {
                await confirmDiscardingUnsavedChanges();
                setUnsavedChanges(false);
              }
              navigate(getAppPath(
                PathTemplate.EXISTING_NOTE,
                new Map([
                  ["GRAPH_ID", LOCAL_GRAPH_ID],
                  ["SLUG", "random"],
                ]),
              ));
            }}
          />
        </>
        : ""
    }
  </>;
};

export default NoteControls;
