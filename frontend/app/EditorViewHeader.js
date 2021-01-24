import React from "react";
import AppTitle from "./AppTitle.js";
import AppStats from "./AppStats.js";
import { shortenText } from "./lib/utils.js";

const PinnedNote = ({
  note,
  isActive,
  onClick,
}) => {
  return <div
    style={{
      padding: "0px 10px",
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
    }}
    className={"pinned-note " + (isActive ? "active" : "")}
    onClick={onClick}
  >
    <img
      src={"/assets/icons/push_pin-24px.svg"}
      alt={"Pinned note"}
      width="24"
      height="24"
      className="svg-icon"
      style={{
        marginRight: "3px",
      }}
    />
    <p
      style={{
        whiteSpace: "pre",
      }}
    >{shortenText(note.title, 35)}</p>
  </div>;
};


const EditorViewHeader = ({
  stats,
  toggleAppMenu,
  pinnedNotes,
  loadNote,
  note,
}) => {
  return (
    <header>
      <AppTitle
        toggleAppMenu={toggleAppMenu}
      />
      <div
        id="pinned-notes"
        style={{
          display: "flex",
          height: "100%",
          overflow: "auto",
          justifyContent: "flex-start",
          width: "100vw",
        }}
      >
        {
          pinnedNotes.length > 0
            ? pinnedNotes.map((pinnedNote) => {
              return <PinnedNote
                key={"pinnedNote_" + pinnedNote.id}
                note={pinnedNote}
                onClick={() => loadNote(pinnedNote.id)}
                isActive={pinnedNote.id === note.id}
              />;
            })
            : <p>Your pinned notes will appear here</p>
        }
      </div>
      <AppStats stats={stats} />
    </header>
  );
};

export default EditorViewHeader;
