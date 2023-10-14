import { l } from "../lib/intl";
import GraphStats from "../lib/notes/interfaces/GraphStats";
import {
  makeTimestampHumanReadable,
  humanFileSize,
} from "../lib/utils";

interface StatsViewMetadataTableProps {
  stats: GraphStats;
  databaseType: string;
}

const StatsViewMetadataTable = ({
  stats,
  databaseType,
}: StatsViewMetadataTableProps) => {
  if (!stats.metadata) throw new Error("No metadata found in stats.");

  return <table className="data-table">
    <tbody>
      <tr>
        <td>{l("stats.metadata.type")}</td>
        <td>{databaseType}</td>
      </tr>
      <tr>
        <td>{l("stats.metadata.created-at")}</td>
        <td>{makeTimestampHumanReadable(stats.metadata.createdAt)}</td>
      </tr>
      <tr>
        <td>{l("stats.metadata.updated-at")}</td>
        <td>{makeTimestampHumanReadable(stats.metadata.updatedAt)}</td>
      </tr>
      <tr>
        <td>{l("stats.metadata.graph-size-without-files")}</td>
        <td>{humanFileSize(stats.metadata.size.graph)}</td>
      </tr>
      <tr>
        <td>{l("stats.metadata.size-of-all-files")}</td>
        <td>{humanFileSize(stats.metadata.size.files)}</td>
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
