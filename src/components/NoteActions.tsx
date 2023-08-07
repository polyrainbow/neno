import { useNavigate } from "react-router-dom";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import useConfirmDiscardingUnsavedChangesDialog
  from "../hooks/useConfirmDiscardingUnsavedChangesDialog";
import ConfirmationServiceContext
  from "../contexts/ConfirmationServiceContext";
import {
  getAppPath,
} from "../lib/utils";
import { PathTemplate } from "../enum/PathTemplate";
import { l } from "../lib/intl";
import ActiveNote from "../types/ActiveNote";
import useNotesProvider from "../hooks/useNotesProvider";
import { exportNote } from "../lib/FrontendFunctions";
import IconButtonWithLabel from "./IconButtonWithLabel";
import { useContext } from "react";
import { Slug } from "../lib/notes/interfaces/Slug";
import CreateNewNoteParams from "../types/CreateNewNoteParams";
import { LOCAL_GRAPH_ID } from "../config";

interface NoteActionsProps {
  activeNote: ActiveNote,
  createNewNote: (params: CreateNewNoteParams) => void,
  createNewLinkedNote: () => void,
  handleNoteSaveRequest: () => void,
  removeActiveNote: () => void,
  unsavedChanges: boolean,
  setUnsavedChanges: (val: boolean) => void,
  pinOrUnpinNote: (slug: Slug) => void,
  duplicateNote: (note: ActiveNote) => void,
  openInGraphView: (note: ActiveNote) => void,
  handleUploadFilesRequest: (files: FileList) => void,
  importNote: (note: ActiveNote) => void,
}

const NoteActions = ({
  activeNote,
  createNewNote,
  createNewLinkedNote,
  handleNoteSaveRequest,
  removeActiveNote,
  unsavedChanges,
  setUnsavedChanges,
  pinOrUnpinNote,
  duplicateNote,
  openInGraphView,
  handleUploadFilesRequest,
  importNote,
}: NoteActionsProps) => {
  const notesProvider = useNotesProvider();
  const confirmDiscardingUnsavedChanges
    = useConfirmDiscardingUnsavedChangesDialog();
  const navigate = useNavigate();
  const isSmallScreen = useIsSmallScreen();
  const confirm = useContext(
    ConfirmationServiceContext,
  ) as (arg0: any) => void;


  return <>
    <h2>{l("note.actions")}</h2>
    <div className="note-actions">
      {
        isSmallScreen
          ? <IconButtonWithLabel
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
            <IconButtonWithLabel
              id="button_new"
              title={l("editor.new-note")}
              icon="add"
              onClick={() => createNewNote({})}
            />
            <IconButtonWithLabel
              id="button_create-linked-note"
              disabled={activeNote.isUnsaved}
              title={l("editor.create-linked-note")}
              icon="add_circle"
              onClick={() => createNewLinkedNote()}
            />
          </>
          : null
      }
      <IconButtonWithLabel
        id="button_upload"
        title={l("editor.save-note")}
        icon="save"
        onClick={handleNoteSaveRequest}
      />
      <IconButtonWithLabel
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
      <IconButtonWithLabel
        id="button_duplicate"
        disabled={activeNote.isUnsaved}
        title={l("editor.duplicate-note")}
        icon="content_copy"
        onClick={duplicateNote}
      />
      <IconButtonWithLabel
        id="button_pin"
        disabled={activeNote.isUnsaved}
        title={l("editor.pin-note")}
        icon="push_pin"
        onClick={() => {
          if (activeNote.isUnsaved) return;
          pinOrUnpinNote(activeNote.slug);
        }}
      />
      <IconButtonWithLabel
        id="button_open-in-graph-view"
        disabled={activeNote.isUnsaved}
        title={l("editor.reveal-note-in-graph")}
        icon="center_focus_strong"
        onClick={openInGraphView}
      />
      <IconButtonWithLabel
        id="button_import-note"
        disabled={!activeNote.isUnsaved}
        title={l("editor.import-note")}
        icon="file_upload"
        onClick={importNote}
      />
      <IconButtonWithLabel
        id="button_export-note"
        disabled={false}
        title={l("editor.export-note")}
        icon="file_download"
        onClick={() => {
          if (!notesProvider) return;
          exportNote(activeNote, notesProvider);
        }}
      />
      <IconButtonWithLabel
        id="button_upload-file"
        disabled={false}
        title={l("editor.upload-file")}
        icon="upload_file"
        onClick={handleUploadFilesRequest}
      />
      <IconButtonWithLabel
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
    </div>
  </>;
};

export default NoteActions;
