import React from "react";
import * as Config from "./lib/config.js";
import IconButton from "./IconButton.js";

const NoteControls = ({
  activeNote,
  createNewNote,
  saveNote,
  removeActiveNote,
  unsavedChanges,
}) => {
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
        onClick={() => {
          saveNote({ ignoreDuplicateTitles: false }).catch((e) => {
            if (e.message === "NOTE_WITH_SAME_TITLE_EXISTS") {
              if (confirm(
                Config.texts.titleAlreadyExistsConfirmation,
              )) {
                saveNote({ ignoreDuplicateTitles: true }).catch((e) => {
                  alert(e);
                });
              }
            }
          });
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
        onClick={() => {
          if (confirm("Do you really want to remove this note?")) {
            removeActiveNote();
          }
        }}
      />
    </div>
    <div id="note-controls-right">
      {
        unsavedChanges
          ? <span title="Unsaved changes">✳️</span>
          : <span title="No unsaved changes">✔️</span>
      }
    </div>
  </section>;
};

export default NoteControls;
