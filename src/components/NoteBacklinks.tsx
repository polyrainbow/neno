import NoteListItem from "./NoteListItem";
import useGoToNote from "../hooks/useGoToNote";
import useConfirmDiscardingUnsavedChangesDialog
  from "../hooks/useConfirmDiscardingUnsavedChangesDialog";
import { l } from "../lib/intl";
import ActiveNote from "../types/ActiveNote";
import { Slug } from "../lib/notes/types/Slug";


interface NoteBacklinksProps {
  note: ActiveNote,
  setUnsavedChanges: (val: boolean) => void,
  unsavedChanges: boolean,
  onLinkIndicatorClick: (slug: Slug, title: string) => void,
}


const NoteBacklinks = ({
  note,
  setUnsavedChanges,
  unsavedChanges,
  onLinkIndicatorClick,
}: NoteBacklinksProps) => {
  const goToNote = useGoToNote();
  const confirmDiscardingUnsavedChanges
    = useConfirmDiscardingUnsavedChangesDialog();

  if (!("backlinks" in note)) return <></>;


  return <div className="note-backlinks-section">
    <h2>{l(
      "editor.backlinks",
      { backlinks: note.backlinks.length.toString() },
    )}</h2>
    {
      note.backlinks.length === 0
        ? <p className="note-meta-paragraph"
        >{l("editor.no-backlinks-yet")}</p>
        : null
    }
    <div className="note-backlinks">
      {
        note.backlinks
          .sort((a, b) => (b.updatedAt ?? 0) - (a.updatedAt ?? 0))
          .map((displayedLinkedNote) => <NoteListItem
            key={"note-link-list-item-" + displayedLinkedNote.slug}
            note={displayedLinkedNote}
            onSelect={async () => {
              if (unsavedChanges) {
                await confirmDiscardingUnsavedChanges();
                setUnsavedChanges(false);
              }

              goToNote(displayedLinkedNote.slug);
            }}
            isActive={false}
            isLinked={true}
            isSelected={false}
            isLinkable={true}
            onLinkIndicatorClick={() => {
              onLinkIndicatorClick(
                displayedLinkedNote.slug,
                displayedLinkedNote.title,
              );
            }}
          />)
      }
    </div>
  </div>;
};

export default NoteBacklinks;
