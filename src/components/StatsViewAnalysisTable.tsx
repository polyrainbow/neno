import { LOCAL_GRAPH_ID, emojis } from "../config";
import {
  getAppPath,
} from "../lib/utils";
import { Link } from "react-router-dom";
import { PathTemplate } from "../enum/PathTemplate";
import { l, lf } from "../lib/intl";
import GraphStats from "../lib/notes/interfaces/GraphStats";

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
    numberOfComponents,
    numberOfHubs,
    nodesWithHighestNumberOfLinks,
    numberOfComponentsWithMoreThanOneNode,
  } = stats;

  const percentageOfUnlinkedNotes
    = (numberOfAllNotes > 0)
      ? Math.round(
        (numberOfUnlinkedNotes / numberOfAllNotes) * 100 * 100,
      ) / 100
      : NaN;

  const maxPossibleLinks
    = (numberOfAllNotes * (numberOfAllNotes - 1)) / 2;

  // not to be confused with meshedness coefficient because this is not a
  // planar graph
  const meshedness = (maxPossibleLinks > 0)
    ? (numberOfLinks / maxPossibleLinks)
    : 0;

  const meshednessPercentage = meshedness * 100;

  return <table className="data-table">
    <tbody>
      <tr>
        <td>{emojis.note} {l("stats.analysis.nodes-notes")}</td>
        <td>{numberOfAllNotes.toLocaleString()}</td>
      </tr>
      <tr>
        <td>{emojis.link} {l("stats.analysis.links-edges")}</td>
        <td>{numberOfLinks.toLocaleString()}</td>
      </tr>
      <tr>
        <td>{emojis.unlinked} {l("stats.unlinked-notes")}</td>
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
        <td>{numberOfComponents.toLocaleString()}</td>
      </tr>
      <tr>
        <td>{l("stats.analysis.components-with-more-than-one-node")}</td>
        <td>{
          numberOfComponentsWithMoreThanOneNode.toLocaleString()
        }</td>
      </tr>
      <tr>
        <td>{lf("stats.analysis.cyclomatic-number")}</td>
        <td>{
          (numberOfLinks - numberOfAllNotes + numberOfComponents)
            .toLocaleString()
        }</td>
      </tr>
      <tr>
        <td>{l("stats.analysis.meshedness")}</td>
        <td>{
          meshednessPercentage.toLocaleString()
        } %</td>
      </tr>
      <tr>
        <td>{emojis.hub} {l("stats.analysis.hubs")}</td>
        <td>{
          numberOfHubs.toLocaleString()
        }</td>
      </tr>
      <tr>
        <td>🔥 {l("stats.analysis.nodes-with-most-links")}</td>
        <td>
          {
            numberOfAllNotes > 0
              ? nodesWithHighestNumberOfLinks.map((note) => {
                return <p
                  key={
                    `stats_nodesWithHighesNumberOfLinks_${note.slug}`
                  }
                  className="no-margin"
                >
                  <Link to={
                    getAppPath(
                      PathTemplate.EXISTING_NOTE,
                      new Map([
                        ["GRAPH_ID", LOCAL_GRAPH_ID],
                        ["SLUG", note.slug],
                      ]),
                    )
                  }>
                    {note.title}
                  </Link>
                  <span> </span>
                  ({note.linkCount.sum.toLocaleString()})
                </p>;
              })
              : l("stats.analysis.no-notes-yet")
          }
        </td>
      </tr>
    </tbody>
  </table>;
};

export default StatsViewAnalysisTable;