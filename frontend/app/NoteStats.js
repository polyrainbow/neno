import React from "react";
import {
  makeTimestampHumanReadable,
  getUrlForFileId,
} from "./lib/utils.js";

const NoteStats = ({
  note,
  databaseProvider,
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
                  return <React.Fragment key={block.data.file.url + note.id}>
                    <a
                      href={block.data.file.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {block.data.file.fileId}
                    </a>
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
                    <a
                      key={block.data.file.fileId + note.id}
                      style={{
                        "cursor": "pointer",
                      }}
                      onClick={async () => {
                        const fileId = block.data.file.fileId;
                        const url = await getUrlForFileId(
                          fileId,
                          databaseProvider,
                        );
                        window.open(url, "_blank");
                      }}
                    >
                      {block.data.file.name}
                    </a>
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
