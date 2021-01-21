import React from "react";
import * as Config from "./lib/config.js";
import IconButton from "./IconButton.js";
import UnsavedChangesIndicator from "./UnsavedChangesIndicator.js";
import ConfirmationServiceContext from "./ConfirmationServiceContext.js";

const NoteControls = ({
  activeNote,
  createNewNote,
  saveNote,
  removeActiveNote,
  unsavedChanges,
  pinNote,
}) => {
  const confirm = React.useContext(ConfirmationServiceContext);

  return <section id="note-controls">
    <div id="note-controls-left">
      <IconButton
        id="button_new"
        title="New note"
        icon="note_add"
        onClick={createNewNote}
      />
      <IconButton
        id="button_upload"
        title="Save note"
        icon="save"
        onClick={async () => {
          try {
            await saveNote({ ignoreDuplicateTitles: false });
          } catch (e) {
            if (e.message === "NOTE_WITH_SAME_TITLE_EXISTS") {
              await confirm({
                text: Config.texts.titleAlreadyExistsConfirmation,
                confirmText: "Save anyway",
                cancelText: "Cancel",
                encourageConfirmation: false,
              });

              saveNote({ ignoreDuplicateTitles: true }).catch((e) => {
                alert(e);
              });
            }
          }
        }}
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
        id="button_pin"
        disabled={activeNote.isUnsaved}
        title="Pin note"
        icon="push_pin"
        onClick={pinNote}
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
