import React, { useState, useEffect } from "react";
import HeaderContainer from "./HeaderContainer";
import { emojis, paths } from "../lib/config.js";
import {
  makeTimestampHumanReadable,
  humanFileSize,
} from "../lib/utils.js";

const StatsView = ({
  databaseProvider,
  toggleAppMenu,
}) => {
  const [stats, setStats] = useState<any>(null);
  // status can be READY, BUSY
  const [status, setStatus] = useState("BUSY");

  useEffect(() => {
    if (!databaseProvider) return;

    const updateStats = async () => {
      const stats = await databaseProvider.getStats({
        includeMetadata: true,
        includeAnalysis: true,
      });
      setStats(stats);
      setStatus("READY");
    };

    updateStats();
  }, [databaseProvider]);

  const percentageOfUnlinkedNotes
    = (stats && (stats.numberOfAllNotes > 0))
      ? Math.round(
        (stats.numberOfUnlinkedNotes / stats.numberOfAllNotes) * 100 * 100,
      ) / 100
      : NaN;

  return <>
    <HeaderContainer
      toggleAppMenu={toggleAppMenu}
    />
    <section className="content-section">
      <h1>Graph Stats</h1>
      {
        status === "READY"
          ? <>
            <h2>Metadata</h2>
            <table className="data-table stats-table">
              <tbody>
                <tr>
                  <td>ID</td>
                  <td>{stats.id}</td>
                </tr>
                <tr>
                  <td>Type</td>
                  <td>{databaseProvider.constructor.type}</td>
                </tr>
                <tr>
                  <td>Creation time</td>
                  <td>{makeTimestampHumanReadable(stats.creationTime)}</td>
                </tr>
                <tr>
                  <td>Update time</td>
                  <td>{makeTimestampHumanReadable(stats.updateTime)}</td>
                </tr>
                <tr>
                  <td>Size of graph (without files)</td>
                  <td>{humanFileSize(stats.size.graph)}</td>
                </tr>
                <tr>
                  <td>Size of all files</td>
                  <td>{humanFileSize(stats.size.files)}</td>
                </tr>
                <tr>
                  <td>
                    {emojis.document}{emojis.image}{emojis.audio}{emojis.video}
                    <span> </span>Number of files
                  </td>
                  <td>{stats.numberOfFiles.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>{emojis.pin} Pins</td>
                  <td>{stats.numberOfPins.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
            <h2>Analysis</h2>
            <table className="data-table stats-table">
              <tbody>
                <tr>
                  <td>{emojis.note} Notes</td>
                  <td>{stats.numberOfAllNotes.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>{emojis.link} Links</td>
                  <td>{stats.numberOfLinks.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>{emojis.unlinked} Unlinked notes</td>
                  <td>{
                    stats.numberOfUnlinkedNotes.toLocaleString()
                    + (
                      stats.numberOfAllNotes > 0
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
                  <td>{stats.numberOfComponents.toLocaleString()}</td>
                </tr>
                <tr>
                  <td>Components with more than one node</td>
                  <td>{
                    stats.numberOfComponentsWithMoreThanOneNode
                      .toLocaleString()
                  }</td>
                </tr>
                <tr>
                  <td>{emojis.hub} Hubs (nodes with more than 4 links)</td>
                  <td>{
                    stats.numberOfHubs.toLocaleString()
                  }</td>
                </tr>
                <tr>
                  <td>🔥 Nodes with highest number of links</td>
                  <td>
                    {
                      stats.numberOfAllNotes > 0
                        ? stats.nodesWithHighestNumberOfLinks.map((note) => {
                          return <p
                            key={
                              `stats_nodesWithHighesNumberOfLinks_${note.id}`
                            }
                            style={{
                              "margin": "0",
                            }}
                          >
                            <a href={
                              paths.editorWithNote.replace("%NOTE_ID%", note.id)
                            }>
                              {note.title}
                            </a> ({note.numberOfLinkedNotes.toLocaleString()})
                          </p>;
                        })
                        : "There are no nodes yet."
                    }
                  </td>
                </tr>
              </tbody>
            </table>
          </>
          : <p>Fetching stats...</p>
      }
    </section>
  </>;
};

export default StatsView;
