import React from "react";
import HeaderContainer from "./HeaderContainer.js";
import EditorViewHeaderControls from "./EditorViewHeaderControls.js";
import AppStats from "./AppStats.js";

const PinnedNote = ({
  note,
  onClick,
}) => {
  return <div
    style={{
      borderLeft: "5px solid black",
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
    />
    <p>{note.title}</p>
  </div>;
};


const EditorViewHeader = ({
  stats,
  openImportLinksDialog,
  openExportDatabaseDialog,
  showNotesWithDuplicateURLs,
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
          <EditorViewHeaderControls
            openImportLinksDialog={openImportLinksDialog}
            showNotesWithDuplicateURLs={showNotesWithDuplicateURLs}
            toggleAppMenu={toggleAppMenu}
          />
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
