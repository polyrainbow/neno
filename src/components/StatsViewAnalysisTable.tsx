import { l, lf } from "../lib/intl";
import GraphStats from "../lib/notes/types/GraphStats";
import { ISOTimestampToLocaleString, humanFileSize } from "../lib/utils";

interface StatsViewAnalysisTableProps {
  stats: Required<GraphStats>;
}

const StatsViewAnalysisTable = ({
  stats,
}: StatsViewAnalysisTableProps) => {
  const {
    numberOfAllNotes,
    numberOfUnlinkedNotes,
    numberOfLinks,
    analysis,
    numberOfAliases,
  } = stats;

  const percentageOfUnlinkedNotes
    = (numberOfAllNotes > 0)
      ? Math.round(
        (numberOfUnlinkedNotes / numberOfAllNotes) * 100 * 100,
      ) / 100
      : NaN;

  return <table className="data-table">
    <tbody>
      <tr>
        <td>{l("stats.metadata.created-at")}</td>
        <td>{ISOTimestampToLocaleString(stats.metadata.createdAt)}</td>
      </tr>
      <tr>
        <td>{l("stats.metadata.updated-at")}</td>
        <td>{ISOTimestampToLocaleString(stats.metadata.updatedAt)}</td>
      </tr>
      <tr>
        <td>{l("stats.analysis.notes")}</td>
        <td>{numberOfAllNotes.toLocaleString()}</td>
      </tr>
      <tr>
        <td>{l("stats.analysis.aliases")}</td>
        <td>{numberOfAliases.toLocaleString()}</td>
      </tr>
      <tr>
        <td>{l("stats.analysis.notes-and-aliases")}</td>
        <td>{(numberOfAllNotes + numberOfAliases).toLocaleString()}</td>
      </tr>
      <tr>
        <td>{l("stats.analysis.links")}</td>
        <td>{numberOfLinks.toLocaleString()}</td>
      </tr>
      <tr>
        <td>{l("stats.unlinked-notes")}</td>
        <td>{
          numberOfUnlinkedNotes.toLocaleString()
          + (
            numberOfAllNotes > 0
              ? ` (${percentageOfUnlinkedNotes.toLocaleString()} %)`
              : ""
          )
        }</td>
      </tr>
      <tr>
        <td>{lf("stats.analysis.components")}</td>
        <td>{analysis.numberOfComponents.toLocaleString()}</td>
      </tr>
      <tr>
        <td>{l("stats.analysis.components-with-more-than-one-node")}</td>
        <td>{
          analysis.numberOfComponentsWithMoreThanOneNode.toLocaleString()
        }</td>
      </tr>
      <tr>
        <td>{lf("stats.analysis.cyclomatic-number")}</td>
        <td>{
          (numberOfLinks - numberOfAllNotes + analysis.numberOfComponents)
            .toLocaleString()
        }</td>
      </tr>
      <tr>
        <td>{l("stats.metadata.size-of-notes")}</td>
        <td>{humanFileSize(stats.metadata.size.notes)}</td>
      </tr>
      <tr>
        <td>{l("stats.metadata.size-of-all-files")}</td>
        <td>{humanFileSize(stats.metadata.size.files)}</td>
      </tr>
      <tr>
        <td>{l("stats.metadata.total-storage-size")}</td>
        <td>{humanFileSize(stats.metadata.size.total)}</td>
      </tr>
      <tr>
        <td>{l("stats.metadata.number-of-files")}</td>
        <td>{stats.numberOfFiles.toLocaleString()}</td>
      </tr>
      <tr>
        <td>{l("stats.metadata.pins")}</td>
        <td>{stats.numberOfPins.toLocaleString()}</td>
      </tr>
      <tr>
        <td>{l("stats.metadata.graph-version")}</td>
        <td>{stats.metadata.version}</td>
      </tr>
    </tbody>
  </table>;
};

export default StatsViewAnalysisTable;
