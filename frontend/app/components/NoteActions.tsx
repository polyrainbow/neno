import React from "react";
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
import { ContentMode } from "../types/ContentMode";
import ActiveNote from "../types/ActiveNote";
import { GraphId } from "../../../lib/notes/interfaces/GraphId";
import useDatabaseProvider from "../hooks/useDatabaseProvider";
import { exportNote } from "../lib/FrontendFunctions";
import IconButtonWithLabel from "./IconButtonWithLabel";

interface NoteActionsProps {
  activeNote: ActiveNote,
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
  contentMode,
  toggleEditMode,
  importNote,
  graphId: GraphId,
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
  contentMode,
  toggleEditMode,
  importNote,
  graphId,
}: NoteActionsProps) => {
  const databaseProvider = useDatabaseProvider();
  const confirmDiscardingUnsavedChanges
    = useConfirmDiscardingUnsavedChangesDialog();
  const navigate = useNavigate();
  const isSmallScreen = useIsSmallScreen();
  const confirm = React.useContext(ConfirmationServiceContext) as (any) => void;


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
                new Map([["GRAPH_ID", graphId]]),
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
              onClick={() => createNewNote()}
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
        title={l(
          contentMode === ContentMode.EDITOR
            ? "editor.finish-editing"
            : "editor.edit-note",
        )}
        icon={contentMode === ContentMode.EDITOR ? "preview" : "create"}
        onClick={toggleEditMode}
      />
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
          pinOrUnpinNote(activeNote.id);
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
          if (!databaseProvider) return;
          exportNote(activeNote, graphId, databaseProvider);
        }}
      />
      <IconButtonWithLabel
        id="button_upload-file"
        disabled={false}
        title={l("editor.upload-file")}
        icon="upload_file"
        onClick={handleUploadFilesRequest}
      />
    </div>
  </>;
};

export default NoteActions;
