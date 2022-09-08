import React from "react";
import AppTitle from "./AppTitle";
import AppHeaderStats from "./AppHeaderStats";
import NoteViewHeaderPinnedNote from "./NoteViewHeaderPinnedNote";
import useGoToNote from "../hooks/useGoToNote";
import useConfirmDiscardingUnsavedChangesDialog
  from "../hooks/useConfirmDiscardingUnsavedChangesDialog";
import { l } from "../lib/intl";
import GraphStats from "../../../lib/notes/interfaces/GraphStats";
import NoteToTransmit from "../../../lib/notes/interfaces/NoteToTransmit";
import ActiveNote from "../interfaces/ActiveNote";

interface NoteViewHeaderProps {
  stats: GraphStats | null,
  toggleAppMenu,
  pinnedNotes: NoteToTransmit[],
  activeNote: ActiveNote | null,
  unsavedChanges: boolean,
  setUnsavedChanges,
}

const NoteViewHeader = ({
  stats,
  toggleAppMenu,
  pinnedNotes,
  activeNote,
  unsavedChanges,
  setUnsavedChanges,
}: NoteViewHeaderProps) => {
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
              return <NoteViewHeaderPinnedNote
                key={`pinnedNote_${pinnedNote.meta.id}`}
                note={pinnedNote}
                onClick={async () => {
                  if (unsavedChanges) {
                    await confirmDiscardingUnsavedChanges();
                    setUnsavedChanges(false);
                  }

                  goToNote(pinnedNote.meta.id);
                }}
                isActive={
                  (!!activeNote)
                  && (!activeNote.isUnsaved)
                  && (pinnedNote.meta.id === activeNote.id)
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

export default NoteViewHeader;
