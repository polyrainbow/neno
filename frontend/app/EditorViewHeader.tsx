import React from "react";
import AppTitle from "./AppTitle";
import AppStats from "./AppStats";
import EditorViewHeaderPinnedNote from "./EditorViewHeaderPinnedNote";
import useGoToNote from "./hooks/useGoToNote";
import useConfirmDiscardingUnsavedChangesDialog
  from "./hooks/useConfirmDiscardingUnsavedChangesDialog";

const EditorViewHeader = ({
  stats,
  toggleAppMenu,
  pinnedNotes,
  activeNote,
  unsavedChanges,
  setUnsavedChanges,
}) => {
  const confirmDiscardingUnsavedChanges
    = useConfirmDiscardingUnsavedChangesDialog();
  const goToNote = useGoToNote();

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
              return <EditorViewHeaderPinnedNote
                key={`pinnedNote_${pinnedNote.id}`}
                note={pinnedNote}
                onClick={async () => {
                  if (unsavedChanges) {
                    await confirmDiscardingUnsavedChanges();
                    setUnsavedChanges(false);
                  }

                  goToNote(pinnedNote.id);
                }}
                isActive={activeNote && (pinnedNote.id === activeNote.id)}
              />;
            })
            : <p
              style={{
                padding: "0px 10px",
              }}
            >Your pinned notes will appear here</p>
        }
      </div>
      <AppStats stats={stats} />
    </header>
  );
};

export default EditorViewHeader;
