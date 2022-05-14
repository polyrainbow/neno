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
            title="Go to list"
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
            title="New note"
            icon="add"
            onClick={createNewNote}
          />
          : null
      }
      <IconButton
        id="button_upload"
        title="Save note"
        icon="save"
        onClick={handleNoteSaveRequest}
      />
      <IconButton
        id="button_remove"
        disabled={activeNote.isUnsaved}
        title="Remove note"
        icon={activeNote.isUnsaved
          ? "delete_disabled"
          : "delete"
        }
        onClick={async () => {
          await confirm({
            text: "Do you really want to remove this note?",
            confirmText: "Remove note",
            cancelText: "Cancel",
            encourageConfirmation: false,
          });

          removeActiveNote();
        }}
      />
      <IconButton
        id="button_duplicate"
        disabled={activeNote.isUnsaved}
        title="Duplicate note"
        icon={activeNote.isUnsaved
          ? "content_copy_disabled"
          : "content_copy"
        }
        onClick={duplicateNote}
      />
      <IconButton
        id="button_pin"
        disabled={activeNote.isUnsaved}
        title="Pin note"
        icon={activeNote.isUnsaved
          ? "push_pin_disabled"
          : "push_pin"
        }
        onClick={pinOrUnpinNote}
      />
      <IconButton
        id="button_open-in-graph-view"
        disabled={activeNote.isUnsaved}
        title="Reveal note in Graph View"
        icon={activeNote.isUnsaved
          ? "center_focus_strong_disabled"
          : "center_focus_strong"
        }
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
