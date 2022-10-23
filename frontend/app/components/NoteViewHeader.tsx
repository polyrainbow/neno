import React, { useContext } from "react";
import AppTitle from "./AppTitle";
import AppHeaderStats from "./AppHeaderStats";
import NoteViewHeaderPinnedNote from "./NoteViewHeaderPinnedNote";
import useGoToNote from "../hooks/useGoToNote";
import useConfirmDiscardingUnsavedChangesDialog
  from "../hooks/useConfirmDiscardingUnsavedChangesDialog";
import { l } from "../lib/intl";
import GraphStats from "../../../lib/notes/interfaces/GraphStats";
import NoteToTransmit from "../../../lib/notes/interfaces/NoteToTransmit";
import ActiveNote from "../types/ActiveNote";
import HeaderContainer from "./HeaderContainer";
import FlexContainer from "./FlexContainer";
import { GraphId } from "../../../lib/notes/interfaces/GraphId";
import UnsavedChangesContext from "../contexts/UnsavedChangesContext";
import AppMenuContext from "../contexts/AppMenuContext";

interface NoteViewHeaderProps {
  stats: GraphStats | null,
  pinnedNotes: NoteToTransmit[] | null,
  activeNote: ActiveNote | null,
  graphId: GraphId,
}

const NoteViewHeader = ({
  stats,
  pinnedNotes,
  activeNote,
  graphId,
}: NoteViewHeaderProps) => {
  const confirmDiscardingUnsavedChanges
    = useConfirmDiscardingUnsavedChangesDialog();
  const goToNote = useGoToNote();
  const [unsavedChanges, setUnsavedChanges] = useContext(UnsavedChangesContext);
  const { toggleAppMenu } = useContext(AppMenuContext);

  return (
    <HeaderContainer>
      <AppTitle
        toggleAppMenu={toggleAppMenu}
      />
      <FlexContainer
        className="pinned-notes"
      >
        {
          Array.isArray(pinnedNotes)
            ? pinnedNotes.length > 0
              ? pinnedNotes.map((pinnedNote) => {
                return <NoteViewHeaderPinnedNote
                  key={`pinnedNote_${pinnedNote.meta.id}`}
                  note={pinnedNote}
                  onClick={async () => {
                    if (unsavedChanges) {
                      await confirmDiscardingUnsavedChanges();
                      setUnsavedChanges(false);
                    }

                    goToNote(graphId, pinnedNote.meta.id);
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
            : ""
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
