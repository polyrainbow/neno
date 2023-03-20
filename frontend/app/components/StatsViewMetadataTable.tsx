import React from "react";
import { l } from "../lib/intl";
import {
  makeTimestampHumanReadable,
  humanFileSize,
} from "../lib/utils";

const StatsViewMetadataTable = ({ stats, databaseType }) => {
  return <table className="data-table">
    <tbody>
      <tr>
        <td>{l("stats.metadata.id")}</td>
        <td>{stats.id}</td>
      </tr>
      <tr>
        <td>{l("stats.metadata.type")}</td>
        <td>{databaseType}</td>
      </tr>
      <tr>
        <td>{l("stats.metadata.created-at")}</td>
        <td>{makeTimestampHumanReadable(stats.createdAt)}</td>
      </tr>
      <tr>
        <td>{l("stats.metadata.updated-at")}</td>
        <td>{makeTimestampHumanReadable(stats.updatedAt)}</td>
      </tr>
      <tr>
        <td>{l("stats.metadata.graph-size-without-files")}</td>
        <td>{humanFileSize(stats.size.graph)}</td>
      </tr>
      <tr>
        <td>{l("stats.metadata.size-of-all-files")}</td>
        <td>{humanFileSize(stats.size.files)}</td>
      </tr>
      <tr>
        <td>{l("stats.metadata.number-of-files")}</td>
        <td>{stats.numberOfFiles.toLocaleString()}</td>
      </tr>
      <tr>
        <td>{l("stats.metadata.pins")}</td>
        <td>{stats.numberOfPins.toLocaleString()}</td>
      </tr>
    </tbody>
  </table>;
};

export default StatsViewMetadataTable;
