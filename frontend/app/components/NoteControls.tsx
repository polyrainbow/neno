import React from "react";
import IconButton from "./IconButton";
import UnsavedChangesIndicator from "./UnsavedChangesIndicator";
import { useNavigate } from "react-router-dom";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import useConfirmDiscardingUnsavedChangesDialog
  from "../hooks/useConfirmDiscardingUnsavedChangesDialog";
import ConfirmationServiceContext
  from "../contexts/ConfirmationServiceContext";
import { getAppPath, getWritableStream } from "../lib/utils";
import { PathTemplate } from "../enum/PathTemplate";
import { l } from "../lib/intl";
import { ContentMode } from "../interfaces/ContentMode";
import Tooltip from "./Tooltip";
import Icon from "./Icon";
import DatabaseProvider from "../interfaces/DatabaseProvider";
import ActiveNote from "../interfaces/ActiveNote";

interface NoteControlsProps {
  databaseProvider: DatabaseProvider,
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
  uploadFiles,
  contentMode,
  toggleEditMode,
  uploadInProgress,
}

const NoteControls = ({
  databaseProvider,
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
  uploadFiles,
  contentMode,
  toggleEditMode,
  uploadInProgress,
}: NoteControlsProps) => {
  const confirmDiscardingUnsavedChanges
    = useConfirmDiscardingUnsavedChangesDialog();
  const navigate = useNavigate();
  const isSmallScreen = useIsSmallScreen();
  const confirm = React.useContext(ConfirmationServiceContext) as (any) => void;


  const exportNote = async (): Promise<void> => {
    if (activeNote.isUnsaved) return;
    const rawNote = await databaseProvider.getRawNote(activeNote.id);

    const opts = {
      suggestedName: activeNote.title + ".neno",
      types: [{
        description: "NENO note",
        accept: { "application/neno-note": [".neno"] },
      }],
    };

    const writableStream = await getWritableStream(opts);
    const writer = writableStream.getWriter();
    await writer.write(rawNote);
    writer.close();
  };


  return <section id="note-controls">
    <div id="note-controls-left">
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
              navigate(getAppPath(PathTemplate.LIST));
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
              onClick={() => createNewNote()}
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
        title={l(
          contentMode === ContentMode.EDITOR
            ? "editor.finish-editing"
            : "editor.edit-note",
        )}
        icon={contentMode === ContentMode.EDITOR ? "preview" : "create"}
        onClick={toggleEditMode}
      />
      <IconButton
        id="button_upload"
        title={l("editor.save-note")}
        icon="save"
        onClick={handleNoteSaveRequest}
      />
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
          pinOrUnpinNote(activeNote.id);
        }}
      />
      <IconButton
        id="button_open-in-graph-view"
        disabled={activeNote.isUnsaved}
        title={l("editor.reveal-note-in-graph")}
        icon="center_focus_strong"
        onClick={openInGraphView}
      />
      <IconButton
        id="button_export-note"
        disabled={activeNote.isUnsaved}
        title={l("editor.export-note")}
        icon="file_download"
        onClick={exportNote}
      />
      <IconButton
        id="button_upload-file"
        disabled={false}
        title={l("editor.upload-file")}
        icon="upload_file"
        onClick={uploadFiles}
      />
    </div>
    <div id="note-controls-right">
      {
        uploadInProgress
          ? <Tooltip
            title={l("editor.note-has-not-been-saved-yet")}
          >
            <Icon
              icon={"file_upload"}
              title={l("editor.upload-in-progress")}
              size={24}
            />
          </Tooltip>
          : ""
      }
      <UnsavedChangesIndicator
        isUnsaved={activeNote.isUnsaved}
        unsavedChanges={unsavedChanges}
      />
    </div>
  </section>;
};

export default NoteControls;
