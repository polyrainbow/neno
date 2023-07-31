import subwaytext from "../lib/subwaytext/index";
import { SavedActiveNote } from "../types/ActiveNote";
import { l } from "../lib/intl";
import {
  makeTimestampHumanReadable,
  humanFileSize,
} from "../lib/utils";
import NoteStatsFileLink from "./NoteStatsFileLink";
import { getMediaTypeFromFilename } from "../lib/notes/noteUtils";
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
          <td>{l("editor.stats.id")}</td>
          <td>{note.slug}</td>
        </tr>
        <tr>
          <td>{l("editor.stats.created-at")}</td>
          <td>{
            note.createdAt === undefined
              ? l("editor.stats.unknown")
              : makeTimestampHumanReadable(note.createdAt)
          }</td>
        </tr>
        <tr>
          <td>{l("editor.stats.updated-at")}</td>
          <td>{
            note.updatedAt === undefined
              ? l("editor.stats.unknown")
              : makeTimestampHumanReadable(note.updatedAt)
          }</td>
        </tr>
        <tr>
          <td>{l("editor.stats.number-of-blocks")}</td>
          <td>{subwaytext(note.content).length}</td>
        </tr>
        <tr>
          <td>{l("editor.stats.number-of-lines")}</td>
          <td>{note.content.split("\n").length}</td>
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
            note.files.length > 0
              ? note.files
                .map((file, i, array) => {
                  const fileType = getMediaTypeFromFilename(file.fileId);

                  return <Fragment
                    key={"nsfwt_" + file.fileId + note.slug}
                  >
                    <NoteStatsFileLink
                      file={file}
                    /> ({fileType}, {humanFileSize(file.size)})
                    {
                      i < array.length - 1
                        ? <br />
                        : null
                    }
                  </Fragment>;
                })
              : l("editor.stats.files.none")
          }</td>
        </tr>
        <tr>
          <td>{l("editor.stats.coordinates")}</td>
          <td>{"X: " + note.position.x}<br />{"Y: " + note.position.y}</td>
        </tr>
        <tr>
          <td>{l("editor.stats.flags")}</td>
          <td>{
            note.flags.length > 0
              ? note.flags.join(", ")
              : l("editor.stats.flags.none")
          }</td>
        </tr>
        <tr>
          <td>{l("editor.stats.content-type")}</td>
          <td>{note.contentType}</td>
        </tr>
      </tbody>
    </table>
  </div>;
};

export default NoteStats;
