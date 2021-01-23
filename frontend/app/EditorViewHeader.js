import React from "react";
import HeaderContainer from "./HeaderContainer.js";
import AppStats from "./AppStats.js";
import { shortenText } from "./lib/utils.js";

const PinnedNote = ({
  note,
  onClick,
}) => {
  return <div
    style={{
      margin: "0px 10px",
      display: "flex",
      alignItems: "center",
      cursor: "pointer",
    }}
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
    <p>{shortenText(note.title, 35)}</p>
  </div>;
};


const EditorViewHeader = ({
  stats,
  openExportDatabaseDialog,
  toggleAppMenu,
  pinnedNotes,
  loadNote,
}) => {
  return (
    <HeaderContainer
      toggleAppMenu={toggleAppMenu}
      openExportDatabaseDialog={openExportDatabaseDialog}
      leftContent={
        <>
          {
            pinnedNotes.map((pinnedNote) => {
              return <PinnedNote
                key={"pinnedNote_" + pinnedNote.id}
                note={pinnedNote}
                onClick={() => loadNote(pinnedNote.id)}
              />;
            })
          }
        </>
      }
      rightContent={
        <AppStats stats={stats} />
      }
    />
  );
};

export default EditorViewHeader;
