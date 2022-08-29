import React from "react";
import subwaytext from "../../../lib/subwaytext/index";
import { SavedActiveNote } from "../interfaces/ActiveNote";
import DatabaseProvider from "../interfaces/DatabaseProvider";
import { l } from "../lib/intl";
import {
  makeTimestampHumanReadable,
  humanFileSize,
  getMediaTypeFromFilename,
} from "../lib/utils";
import NoteStatsFileLink from "./NoteStatsFileLink";

interface NoteStatsProps {
  note: SavedActiveNote,
  databaseProvider: DatabaseProvider
}

const NoteStats = ({
  note,
  databaseProvider,
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
          <td>{makeTimestampHumanReadable(note.creationTime)}</td>
        </tr>
        <tr>
          <td>{l("editor.stats.last-update-time")}</td>
          <td>{makeTimestampHumanReadable(note.updateTime)}</td>
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
                      databaseProvider={databaseProvider}
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
          <td>{l("editor.stats.x-coordinate")}</td>
          <td>{note.position.x}</td>
        </tr>
        <tr>
          <td>{l("editor.stats.y-coordinate")}</td>
          <td>{note.position.y}</td>
        </tr>
      </tbody>
    </table>
  </div>;
};

export default NoteStats;
