import { SavedActiveNote } from "../types/ActiveNote";
import { l } from "../lib/intl";
import {
  humanFileSize,
  ISOTimestampToLocaleString,
} from "../lib/utils";
import NoteStatsFileLink from "./NoteStatsFileLink";
import { getMediaTypeFromFilename } from "../lib/notes/utils";
import { Fragment } from "react";

interface NoteStatsProps {
  note: SavedActiveNote,
}

const NoteStats = ({
  note,
}: NoteStatsProps) => {
  return <div
    id="stats"
  >
    <h2>{l("editor.stats.heading")}</h2>
    <table className="data-table">
      <tbody>
        <tr>
          <td>{l("editor.stats.slug")}</td>
          <td>{note.slug}</td>
        </tr>
        <tr>
          <td>{l("editor.stats.created-at")}</td>
          <td>{
            note.createdAt === undefined
              ? l("editor.stats.unknown")
              : ISOTimestampToLocaleString(note.createdAt)
          }</td>
        </tr>
        <tr>
          <td>{l("editor.stats.updated-at")}</td>
          <td>{
            note.updatedAt === undefined
              ? l("editor.stats.unknown")
              : ISOTimestampToLocaleString(note.updatedAt)
          }</td>
        </tr>
        <tr>
          <td>{l("editor.stats.number-of-blocks")}</td>
          <td>{note.numberOfBlocks}</td>
        </tr>
        <tr>
          <td>{l("editor.stats.number-of-lines")}</td>
          <td>{note.initialContent.split("\n").length}</td>
        </tr>
        <tr>
          <td>{l("editor.stats.number-of-outgoing-links")}</td>
          <td>{note.outgoingLinks.length}</td>
        </tr>
        <tr>
          <td>{l("editor.stats.number-of-backlinks")}</td>
          <td>{note.backlinks.length}</td>
        </tr>
        <tr>
          <td>{l("editor.stats.number-of-characters")}</td>
          <td>{note.numberOfCharacters}</td>
        </tr>
        <tr>
          <td>{l("editor.stats.files")}</td>
          <td>{
            note.files.size > 0
              ? note.files.values()
                .map((file, i) => {
                  const fileType = getMediaTypeFromFilename(file.filename);

                  return <Fragment
                    key={"nsfwt_" + file.slug + note.slug}
                  >
                    <NoteStatsFileLink
                      file={file}
                    />
                    <span> </span>
                    ({fileType}, {humanFileSize(file.size)})
                    {
                      i < note.files.size - 1
                        ? <br />
                        : null
                    }
                  </Fragment>;
                }).toArray()
              : l("editor.stats.files.none")
          }</td>
        </tr>
        <tr>
          <td>{l("editor.stats.flags")}</td>
          <td>{
            note.flags.length > 0
              ? note.flags.join(", ")
              : l("editor.stats.flags.none")
          }</td>
        </tr>
      </tbody>
    </table>
  </div>;
};

export default NoteStats;
