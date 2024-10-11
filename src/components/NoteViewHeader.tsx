import { Fragment, ReactNode, useContext, useRef, useState } from "react";
import AppTitle from "./AppTitle";
import AppHeaderStats from "./AppHeaderStats";
import NoteViewHeaderPinnedNote from "./NoteViewHeaderPinnedNote";
import useGoToNote from "../hooks/useGoToNote";
import useConfirmDiscardingUnsavedChangesDialog
  from "../hooks/useConfirmDiscardingUnsavedChangesDialog";
import { l } from "../lib/intl";
import GraphStats from "../lib/notes/types/GraphStats";
import NoteToTransmit from "../lib/notes/types/NoteToTransmit";
import ActiveNote from "../types/ActiveNote";
import HeaderContainer from "./HeaderContainer";
import FlexContainer from "./FlexContainer";
import UnsavedChangesContext from "../contexts/UnsavedChangesContext";
import AppMenuContext from "../contexts/AppMenuContext";
import { Slug } from "../lib/notes/types/Slug";
import BusyIndicator from "./BusyIndicator";

interface NoteViewHeaderProps {
  stats: GraphStats | null,
  pinnedNotes: NoteToTransmit[] | null,
  activeNote: ActiveNote | null,
  movePin: (slug: Slug, offset: number) => void,
}

const NoteViewHeader = ({
  stats,
  pinnedNotes,
  activeNote,
  movePin,
}: NoteViewHeaderProps) => {
  const confirmDiscardingUnsavedChanges
    = useConfirmDiscardingUnsavedChangesDialog();
  const goToNote = useGoToNote();
  const [unsavedChanges, setUnsavedChanges] = useContext(UnsavedChangesContext);
  const { toggleAppMenu } = useContext(AppMenuContext);
  const draggedPinIndex = useRef<number>(-1);
  const pinRects = useRef<DOMRect[] | null>(null);
  const [dragTargetSlotIndex, setDragTargetSlotIndex] = useState(-1);

  /*
  Slots are insert positions between pins
  Pin Indexes    | 0 | 1 | 2 |
  Slot Indexes   0   1   2   3
  */

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
              ? pinnedNotes.map(
                (pinnedNote, pinIndex): ReactNode | Iterable<ReactNode> => {
                  return <Fragment key={"pin-fragment-" + pinnedNote.meta.slug}>
                    {
                      draggedPinIndex.current > -1
                      && dragTargetSlotIndex === 0
                      && pinIndex === 0
                      && dragTargetSlotIndex !== draggedPinIndex.current
                      && dragTargetSlotIndex !== draggedPinIndex.current + 1
                        ? <div
                          key={"pin-insert-indicator-start-0"}
                          className="pin-insert-indicator"
                        ></div>
                        : ""
                    }
                    <NoteViewHeaderPinnedNote
                      key={`pinnedNote_${pinnedNote.meta.slug}`}
                      note={pinnedNote}
                      onDragStart={() => {
                        draggedPinIndex.current = pinIndex;
                        setDragTargetSlotIndex(pinIndex);

                        pinRects.current = Array.from(
                          document.querySelectorAll("button.pinned-note"),
                        )
                          .map((el) => {
                            return el.getBoundingClientRect();
                          });
                      }}
                      onDragOver={(e) => {
                        if (!pinRects.current) return;

                        let slotIndex = 0;
                        for (let p = 0; p < pinRects.current.length; p++) {
                          const pinRect = pinRects.current[p];
                          if (e.clientX > (pinRect.x + pinRect.width / 2)) {
                            slotIndex++;
                          } else {
                            break;
                          }
                        }
                        setDragTargetSlotIndex(slotIndex);
                      }}
                      onDragEnd={(e) => {
                        const dpi = draggedPinIndex.current;
                        if (
                          dragTargetSlotIndex === dpi
                          || dragTargetSlotIndex === dpi + 1
                        ) {
                          // nothing to do as slot is adjacent to dragged pin
                          setDragTargetSlotIndex(-1);
                          draggedPinIndex.current = -1;
                          e.preventDefault();
                          e.stopPropagation();
                          return false;
                        }
                        const offset = dragTargetSlotIndex > dpi
                          ? dragTargetSlotIndex - dpi - 1
                          : dragTargetSlotIndex - dpi;
                        movePin(pinnedNote.meta.slug, offset);
                        setDragTargetSlotIndex(-1);
                        draggedPinIndex.current = -1;
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                      }}
                      onClick={async () => {
                        if (
                          activeNote
                          && "slug" in activeNote
                          && pinnedNote.meta.slug === activeNote.slug
                        ) {
                          return;
                        }

                        if (unsavedChanges) {
                          await confirmDiscardingUnsavedChanges();
                          setUnsavedChanges(false);
                        }

                        goToNote(pinnedNote.meta.slug);
                      }}
                      isActive={
                        (!!activeNote)
                        && (!activeNote.isUnsaved)
                        && (pinnedNote.meta.slug === activeNote.slug)
                      }
                    />
                    {
                      draggedPinIndex.current > -1
                      && dragTargetSlotIndex === pinIndex + 1
                      && dragTargetSlotIndex !== draggedPinIndex.current
                      && dragTargetSlotIndex !== draggedPinIndex.current + 1
                        ? <div
                          key={"pin-insert-indicator-end-" + pinIndex}
                          className="pin-insert-indicator"
                        ></div>
                        : ""
                    }
                  </Fragment>;
                },
              )
              : <p
                className="pinned-notes-placeholder"
              >{l("app.pinned-notes-placeholder")}</p>
            : ""
        }
      </FlexContainer>
      {
        stats
          ? <AppHeaderStats stats={stats} />
          : <BusyIndicator alt={l("loading")} height={28} />
      }
    </HeaderContainer>
  );
};

export default NoteViewHeader;
