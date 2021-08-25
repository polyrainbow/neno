import React from "react";
import IconButton from "./IconButton.js";
import UnsavedChangesIndicator from "./UnsavedChangesIndicator.js";
import ConfirmationServiceContext from "./ConfirmationServiceContext.js";
import { useHistory } from "react-router-dom";
import useIsSmallScreen from "./hooks/useIsSmallScreen.js";

const NoteControls = ({
  activeNote,
  createNewNote,
  handleNoteSaveRequest,
  removeActiveNote,
  unsavedChanges,
  pinOrUnpinNote,
  openImportLinksDialog,
  duplicateNote,
  openInGraphView,
}) => {
  const confirm = React.useContext(ConfirmationServiceContext);
  const history = useHistory();
  const isSmallScreen = useIsSmallScreen();

  return <section id="note-controls">
    <div id="note-controls-left">
      {
        isSmallScreen
          ? <IconButton
            id="button_list"
            title="Go to list"
            icon="list"
            onClick={() => history.push("/list")}
          />
          : ""
      }
      {
        !isSmallScreen
          ? <IconButton
            id="button_new"
            title="New note"
            icon="note_add"
            onClick={createNewNote}
          />
          : ""
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
      <IconButton
        id="button_import_links_as_notes"
        title="Import links as notes"
        icon="dynamic_feed"
        onClick={openImportLinksDialog}
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
