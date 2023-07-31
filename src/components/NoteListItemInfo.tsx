import { emojis, SPAN_SEPARATOR } from "../config";
import { l } from "../lib/intl";
import NoteListItemFeatures from "./NoteListItemFeatures";
import NoteListItem from "../lib/notes/interfaces/NoteListItem";
import { shortenText } from "../lib/utils";
import { Fragment } from "react";


const NoteListItemInfo = ({
  note,
}: {
  note: NoteListItem
}) => {
  const isHub = note.linkCount.sum >= 5;

  const sections = [
    <>/{shortenText(note.slug, 50)}</>,
  ];

  if (typeof note.updatedAt === "number") {
    sections.push(
      <span>{(new Date(note.updatedAt)).toLocaleDateString()}</span>,
    );
  }

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

  if (isHub) {
    sections.push(
      <span>{
        emojis.hub + " " + l("list.item.hub")
      }</span>,
    );
  }

  return <div
    className="info"
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
