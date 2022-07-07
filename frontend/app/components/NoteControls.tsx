import React from "react";
import IconButton from "./IconButton.js";
import UnsavedChangesIndicator from "./UnsavedChangesIndicator.js";
import { useNavigate } from "react-router-dom";
import useIsSmallScreen from "../hooks/useIsSmallScreen.js";
import useConfirmDiscardingUnsavedChangesDialog
  from "../hooks/useConfirmDiscardingUnsavedChangesDialog";
import ConfirmationServiceContext
  from "../contexts/ConfirmationServiceContext.js";
import { getAppPath } from "../lib/utils.js";
import { PathTemplate } from "../enum/PathTemplate.js";
import { l } from "../lib/intl.js";

const NoteControls = ({
  activeNote,
  createNewNote,
  handleNoteSaveRequest,
  removeActiveNote,
  unsavedChanges,
  setUnsavedChanges,
  pinOrUnpinNote,
  duplicateNote,
  openInGraphView,
}) => {
  const confirmDiscardingUnsavedChanges
    = useConfirmDiscardingUnsavedChangesDialog();
  const navigate = useNavigate();
  const isSmallScreen = useIsSmallScreen();
  const confirm = React.useContext(ConfirmationServiceContext) as (any) => void;

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
          ? <IconButton
            id="button_new"
            title={l("editor.new-note")}
            icon="add"
            onClick={createNewNote}
          />
          : null
      }
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
        onClick={() => pinOrUnpinNote(activeNote.id)}
      />
      <IconButton
        id="button_open-in-graph-view"
        disabled={activeNote.isUnsaved}
        title={l("editor.reveal-note-in-graph")}
        icon="center_focus_strong"
        onClick={openInGraphView}
      />
    </div>
    <div id="note-controls-right">
      <UnsavedChangesIndicator
        isUnsaved={activeNote.isUnsaved}
        unsavedChanges={unsavedChanges}
      />
    </div>
  </section>;
};

export default NoteControls;
