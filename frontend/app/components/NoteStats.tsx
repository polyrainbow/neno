import React from "react";
import { l } from "../lib/intl.js";
import {
  makeTimestampHumanReadable,
  getFileInfosOfNoteFiles,
} from "../lib/utils.js";
import NoteStatsFileLink from "./NoteStatsFileLink";

const NoteStats = ({
  note,
  databaseProvider,
}) => {
  const fileInfos = getFileInfosOfNoteFiles(note);

  return <div
    id="stats"
  >
    <h2>Stats</h2>
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
          <td>{note.blocks.length}</td>
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
            fileInfos.length > 0
              ? fileInfos
                .map((fileInfo, i, array) => {
                  return <React.Fragment
                    key={"nsfwt_" + fileInfo.fileId + note.id}
                  >
                    <NoteStatsFileLink
                      fileInfo={fileInfo}
                      databaseProvider={databaseProvider}
                    /> ({fileInfo.type})
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
