import React from "react";
import {
  NoteContentBlockFileMetadata,
} from "../../../lib/notes/interfaces/NoteContentBlock.js";
import { SavedActiveNote } from "../interfaces/ActiveNote.js";
import DatabaseProvider from "../interfaces/DatabaseProvider.js";
import { l } from "../lib/intl.js";
import {
  makeTimestampHumanReadable,
  getMetadataOfFilesInNote,
  humanFileSize,
  getFileTypeFromFilename,
} from "../lib/utils.js";
import NoteStatsFileLink from "./NoteStatsFileLink";

interface NoteStatsProps {
  note: SavedActiveNote,
  databaseProvider: DatabaseProvider
}

const NoteStats = ({
  note,
  databaseProvider,
}: NoteStatsProps) => {
  const fileMetadataObjects:NoteContentBlockFileMetadata[]
    = getMetadataOfFilesInNote(note);

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
            fileMetadataObjects.length > 0
              ? fileMetadataObjects
                .map((fileMetadata, i, array) => {
                  const fileType = getFileTypeFromFilename(fileMetadata.fileId);

                  return <React.Fragment
                    key={"nsfwt_" + fileMetadata.fileId + note.id}
                  >
                    <NoteStatsFileLink
                      fileMetadata={fileMetadata}
                      databaseProvider={databaseProvider}
                    /> ({fileType}, {humanFileSize(fileMetadata.size)})
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
