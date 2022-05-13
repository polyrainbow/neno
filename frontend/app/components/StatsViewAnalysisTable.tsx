import React from "react";
import { emojis } from "../lib/config.js";
import {
  getAppPath,
} from "../lib/utils.js";
import { Link } from "react-router-dom";
import { PathTemplate } from "../enum/PathTemplate";

const StatsViewAnalysisTable = ({
  stats,
}) => {
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

  return <table className="data-table stats-table">
    <tbody>
      <tr>
        <td>{emojis.note} Notes/Nodes</td>
        <td>{numberOfAllNotes.toLocaleString()}</td>
      </tr>
      <tr>
        <td>{emojis.link} Links/Edges</td>
        <td>{numberOfLinks.toLocaleString()}</td>
      </tr>
      <tr>
        <td>{emojis.unlinked} Unlinked notes</td>
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
        <td><a
          href="https://en.wikipedia.org/wiki/Component_(graph_theory)"
          target="_blank"
          rel="noreferrer noopener"
        >Components</a></td>
        <td>{numberOfComponents.toLocaleString()}</td>
      </tr>
      <tr>
        <td>Components with more than one node</td>
        <td>{
          numberOfComponentsWithMoreThanOneNode.toLocaleString()
        }</td>
      </tr>
      <tr>
        <td><a
          href="https://en.wikipedia.org/wiki/Circuit_rank"
          target="_blank"
          rel="noreferrer noopener"
        >Cyclomatic number</a></td>
        <td>{
          (numberOfLinks - numberOfAllNotes + numberOfComponents)
            .toLocaleString()
        }</td>
      </tr>
      <tr>
        <td>Meshedness (edges / max. possible edges)</td>
        <td>{
          meshednessPercentage.toLocaleString()
        } %</td>
      </tr>
      <tr>
        <td>{emojis.hub} Hubs (nodes with more than 4 links)</td>
        <td>{
          numberOfHubs.toLocaleString()
        }</td>
      </tr>
      <tr>
        <td>🔥 Nodes with highest number of links</td>
        <td>
          {
            numberOfAllNotes > 0
              ? nodesWithHighestNumberOfLinks.map((note) => {
                return <p
                  key={
                    `stats_nodesWithHighesNumberOfLinks_${note.id}`
                  }
                  style={{
                    "margin": "0",
                  }}
                >
                  <Link to={
                    getAppPath(
                      PathTemplate.EDITOR_WITH_NOTE,
                      new Map([["NOTE_ID", note.id]]),
                    )
                  }>
                    {note.title}
                  </Link>
                  <span> </span>
                  ({note.numberOfLinkedNotes.toLocaleString()})
                </p>;
              })
              : "There are no nodes yet."
          }
        </td>
      </tr>
    </tbody>
  </table>;
};

export default StatsViewAnalysisTable;
