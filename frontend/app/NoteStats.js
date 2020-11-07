import React from "react";
import {
  makeTimestampHumanReadable,
  getNumberOfCharacters,
} from "./lib/utils.js";

const NoteStats = ({
  note,
}) => {
  return <div
    id="stats"
  >
    <h2>Stats</h2>
    <table>
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
          <td>{getNumberOfCharacters(note)}</td>
        </tr>
        <tr>
          <td>X coordinate</td>
          <td>{note.x}</td>
        </tr>
        <tr>
          <td>Y coordinate</td>
          <td>{note.y}</td>
        </tr>
      </tbody>
    </table>
  </div>;
};

export default NoteStats;
