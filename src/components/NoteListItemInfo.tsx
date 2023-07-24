import { emojis, SPAN_SEPARATOR } from "../config";
import { l } from "../lib/intl";
import NoteListItemFeatures from "./NoteListItemFeatures";
import NoteListItem from "../lib/notes/interfaces/NoteListItem";
import { shortenText } from "../lib/utils";


const NoteListItemInfo = ({
  note,
}: {
  note: NoteListItem
}) => {
  const isHub = note.linkCount.sum >= 5;

  return <div
    className="info"
  >
    /{shortenText(note.slug, 50)}{SPAN_SEPARATOR}
    {(new Date(note.updatedAt)).toLocaleDateString()}
    {
      note.numberOfFiles > 0
        ? SPAN_SEPARATOR + l(
          note.numberOfFiles > 1 ? "list.item.files" : "list.item.file",
          { files: note.numberOfFiles.toString() },
        )
        : ""
    }
    {
      /* if note contains at least one feature, show the separator and the
      features */
      (
        Object.values(note.features).some((val) => val === true)
      )
        ? <>{SPAN_SEPARATOR}<NoteListItemFeatures
          features={note.features}
        /></>
        : ""
    }
    {
      isHub
        ? SPAN_SEPARATOR + emojis.hub + " " + l("list.item.hub")
        : ""
    }
  </div>;
};

export default NoteListItemInfo;
