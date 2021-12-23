import React from "react";
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
          <td>ID</td>
          <td>{note.id}</td>
        </tr>
        <tr>
          <td>Creation time</td>
          <td>{makeTimestampHumanReadable(note.creationTime)}</td>
        </tr>
        <tr>
          <td>Last update time</td>
          <td>{makeTimestampHumanReadable(note.updateTime)}</td>
        </tr>
        <tr>
          <td>Number of blocks</td>
          <td>{note.blocks.length}</td>
        </tr>
        <tr>
          <td>Number of links</td>
          <td>{note.linkedNotes?.length || 0}</td>
        </tr>
        <tr>
          <td>Number of characters</td>
          <td>{note.numberOfCharacters}</td>
        </tr>
        <tr>
          <td>Files</td>
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
              : "None"
          }</td>
        </tr>
        <tr>
          <td>X coordinate</td>
          <td>{note.position.x}</td>
        </tr>
        <tr>
          <td>Y coordinate</td>
          <td>{note.position.y}</td>
        </tr>
      </tbody>
    </table>
  </div>;
};

export default NoteStats;
