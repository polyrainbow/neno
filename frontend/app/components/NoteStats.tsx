import React from "react";
import subwaytext from "../../../lib/subwaytext/index";
import { SavedActiveNote } from "../interfaces/ActiveNote";
import { l } from "../lib/intl";
import {
  makeTimestampHumanReadable,
  humanFileSize,
  getMediaTypeFromFilename,
} from "../lib/utils";
import NoteStatsFileLink from "./NoteStatsFileLink";

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
          <td>{note.id}</td>
        </tr>
        <tr>
          <td>{l("editor.stats.creation-time")}</td>
          <td>{makeTimestampHumanReadable(note.createdAt)}</td>
        </tr>
        <tr>
          <td>{l("editor.stats.last-update-time")}</td>
          <td>{makeTimestampHumanReadable(note.updatedAt)}</td>
        </tr>
        <tr>
          <td>{l("editor.stats.number-of-blocks")}</td>
          <td>{subwaytext(note.content).length}</td>
        </tr>
        <tr>
          <td>{l("editor.stats.number-of-links")}</td>
          <td>{note.linkedNotes?.length || 0}</td>
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

                  return <React.Fragment
                    key={"nsfwt_" + file.fileId + note.id}
                  >
                    <NoteStatsFileLink
                      file={file}
                    /> ({fileType}, {humanFileSize(file.size)})
                    {
                      i < array.length - 1
                        ? <br />
                        : null
                    }
                  </React.Fragment>;
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
