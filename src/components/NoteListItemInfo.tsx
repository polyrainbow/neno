import { SPAN_SEPARATOR } from "../config";
import { l } from "../lib/intl";
import NoteListItemFeatures from "./NoteListItemFeatures";
import NoteListItem from "../lib/notes/types/NoteListItem";
import { Fragment } from "react";
import SparseNoteInfo from "../lib/notes/types/SparseNoteInfo";


const NoteListItemInfo = ({
  note,
}: {
  note: NoteListItem | SparseNoteInfo
}) => {
  const sections = [
    <span className="slug" key={"nli-" + note.slug}>/{note.slug}</span>,
  ];

  if (typeof note.updatedAt === "number") {
    sections.push(
      <span>{(new Date(note.updatedAt)).toLocaleDateString()}</span>,
    );
  }

  if ("numberOfFiles" in note) {
    if (note.numberOfFiles > 0) {
      sections.push(
        <span>{
          l(
            note.numberOfFiles > 1 ? "list.item.files" : "list.item.file",
            { files: note.numberOfFiles.toString() },
          )
        }</span>,
      );
    }

    /* if note contains at least one feature, show the separator and the
    features */
    if (Object.values(note.features).some((val) => val === true)) {
      sections.push(
        <NoteListItemFeatures
          features={note.features}
        />,
      );
    }
  }

  return <div
    className="note-list-item-info"
  >
    {sections.map((section, i, sections) => <Fragment
      key={"nlii_" + i}
    >
      {section}
      {i < sections.length - 1 && <span
        className="separator"
      >
        {SPAN_SEPARATOR}
      </span>}
    </Fragment>)}
  </div>;
};

export default NoteListItemInfo;
