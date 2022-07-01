import React from "react";
import AppTitle from "./AppTitle";
import AppHeaderStats from "./AppHeaderStats";
import EditorViewHeaderPinnedNote from "./EditorViewHeaderPinnedNote";
import useGoToNote from "../hooks/useGoToNote";
import useConfirmDiscardingUnsavedChangesDialog
  from "../hooks/useConfirmDiscardingUnsavedChangesDialog";
import { l } from "../lib/intl";
import GraphStats from "../../../lib/notes/interfaces/GraphStats";
import NoteToTransmit from "../../../lib/notes/interfaces/NoteToTransmit";
import ActiveNote from "../interfaces/ActiveNote";

interface EditorViewHeaderProps {
  stats: GraphStats | null,
  toggleAppMenu,
  pinnedNotes: NoteToTransmit[],
  activeNote: ActiveNote | null,
  unsavedChanges: boolean,
  setUnsavedChanges,
}

const EditorViewHeader = ({
  stats,
  toggleAppMenu,
  pinnedNotes,
  activeNote,
  unsavedChanges,
  setUnsavedChanges,
}: EditorViewHeaderProps) => {
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
                isActive={
                  (!!activeNote)
                  && (!activeNote.isUnsaved)
                  && (pinnedNote.id === activeNote.id)
                }
              />;
            })
            : <p
              style={{
                padding: "0px 10px",
              }}
            >{l("app.pinned-notes-placeholder")}</p>
        }
      </div>
      {
        stats
          ? <AppHeaderStats stats={stats} />
          : ""
      }
    </header>
  );
};

export default EditorViewHeader;
