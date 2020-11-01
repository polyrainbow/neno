import React from "react";
import * as API from "./lib/api.js";


const Controls = ({
  activeNote,
  createNewNote,
  saveNote,
  removeActiveNote,
}) => {
  return <section id="controls">
    <div id="controls-left">
      <button
        id="button_new"
        alt="New"
        title="New"
        onClick={createNewNote}
      >
        <img src="/assets/icons/note_add-24px.svg" />
      </button>
      <button
        id="button_upload"
        alt="Save"
        title="Save"
        onClick={saveNote}
      >
        <img src="/assets/icons/save-24px.svg" />
      </button>
      <button
        id="button_remove"
        disabled={activeNote === null}
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
      <button
        id="button_graph" alt="Graph" title="Graph"
        onClick={() => {
          window.location.href = "graph.html";
        }}
      >
        <img src="/assets/icons/account_tree-24px.svg" />
      </button>
      <button
        id="button_archive"
        alt="Download database"
        title="Download database"
        onClick={API.archiveDatabase}
      >
        <img src="/assets/icons/save_alt-24px.svg" />
      </button>
      <a
        href="/api/database-with-uploads"
        className="button"
        id="button_archive-with-uploads"
        alt="Download database including uploads"
        title="Download database including uploads"
        download
      >
        <img src="/assets/icons/archive-24px.svg" />
      </a>
    </div>
  </section>;
};

export default Controls;
