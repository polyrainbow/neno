import React from "react";
import * as Config from "./lib/config.js";

const NoteControls = ({
  activeNote,
  createNewNote,
  saveNote,
  removeActiveNote,
  unsavedChanges,
}) => {
  return <section id="note-controls">
    <div id="note-controls-left">
      <button
        className="icon-button"
        id="button_new"
        alt="New"
        title="New"
        onClick={createNewNote}
      >
        <img src="/assets/icons/note_add-24px.svg" alt="New" />
      </button>
      <button
        className="icon-button"
        id="button_upload"
        alt="Save"
        title="Save"
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
      >
        <img src="/assets/icons/save-24px.svg" alt="Save" />
      </button>
      <button
        className="icon-button"
        id="button_remove"
        disabled={activeNote.isUnsaved}
        alt="Remove"
        title="Remove"
        onClick={() => {
          if (confirm("Do you really want to remove this note?")) {
            removeActiveNote();
          }
        }}
      >
        <img
          src={activeNote.isUnsaved
            ? "/assets/icons/delete-24px_disabled.svg"
            : "/assets/icons/delete-24px.svg"
          }
          alt="Delete"
        />
      </button>
    </div>
    <div id="note-controls-right">
      {
        unsavedChanges
          ? <span title="Unsaved changes">✳️</span>
          : ""
      }
    </div>
  </section>;
};

export default NoteControls;
