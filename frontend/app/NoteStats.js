import React from "react";
import {
  makeTimestampHumanReadable,
} from "./lib/utils.js";
import NoteStatsFileLink from "./NoteStatsFileLink.js";

const NoteStats = ({
  note,
  databaseProvider,
}) => {
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
          <td>{note.editorData.blocks.length}</td>
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
          <td>Images</td>
          <td>{
            note.editorData.blocks
              .filter((block) => block.type === "image").length > 0
              ? note.editorData.blocks
                .filter((block) => block.type === "image")
                .map((block, i, array) => {
                  return <React.Fragment key={block.data.file.fileId + note.id}>
                    <NoteStatsFileLink
                      fileId={block.data.file.fileId}
                      databaseProvider={databaseProvider}
                    />
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
          <td>File attachements</td>
          <td>{
            note.editorData.blocks
              .filter((block) => block.type === "attaches").length > 0
              ? note.editorData.blocks
                .filter((block) => block.type === "attaches")
                .map((block, i, array) => {
                  return <React.Fragment key={block.data.file.fileId + note.id}>
                    <NoteStatsFileLink
                      fileId={block.data.file.fileId}
                      name={block.data.file.name}
                      databaseProvider={databaseProvider}
                    />
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
