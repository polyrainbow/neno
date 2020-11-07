import React from "react";
import * as Config from "./lib/config.js";

const NoteControls = ({
  activeNote,
  createNewNote,
  saveNote,
  removeActiveNote,
}) => {
  return <section id="note-controls">
    <div id="controls-left">
      <button
        id="button_new"
        alt="New"
        title="New"
        onClick={createNewNote}
      >
        <img src="/assets/icons/note_add-24px.svg" alt="New" />
      </button>
      <button
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
        <svg xmlns="http://www.w3.org/2000/svg"
          height="24" viewBox="0 0 24 24" width="24"
        >
          <path
            d={
              "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 "
                + "4h-3.5l-1-1h-5l-1 1H5v2h14V4z"
            }
          />
          <path d="M0 0h24v24H0z" fill="none"/>
        </svg>
      </button>
    </div>
  </section>;
};

export default NoteControls;
