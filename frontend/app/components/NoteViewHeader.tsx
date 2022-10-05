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
import HeaderContainer from "./HeaderContainer";
import FlexContainer from "./FlexContainer";

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
    <HeaderContainer>
      <AppTitle
        toggleAppMenu={toggleAppMenu}
      />
      <FlexContainer
        className="pinned-notes"
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
              className="pinned-notes-placeholder"
            >{l("app.pinned-notes-placeholder")}</p>
        }
      </FlexContainer>
      {
        stats
          ? <AppHeaderStats stats={stats} />
          : ""
      }
    </HeaderContainer>
  );
};

export default NoteViewHeader;
