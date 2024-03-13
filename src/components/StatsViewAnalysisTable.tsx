import { l, lf } from "../lib/intl";
import GraphStats from "../lib/notes/types/GraphStats";

interface StatsViewAnalysisTableProps {
  stats: Required<GraphStats>,
}

const StatsViewAnalysisTable = ({
  stats,
}: StatsViewAnalysisTableProps) => {
  const {
    numberOfAllNotes,
    numberOfUnlinkedNotes,
    numberOfLinks,
    analysis,
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
        <td>{l("stats.analysis.nodes-notes")}</td>
        <td>{numberOfAllNotes.toLocaleString()}</td>
      </tr>
      <tr>
        <td>{l("stats.analysis.links-edges")}</td>
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
    </tbody>
  </table>;
};

export default StatsViewAnalysisTable;
