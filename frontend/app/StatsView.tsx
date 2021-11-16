import React, { useState, useEffect } from "react";
import HeaderContainer from "./HeaderContainer";
import { emojis, paths } from "./lib/config.js";
import {
  makeTimestampHumanReadable,
  humanFileSize,
} from "./lib/utils.js";

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
        includeDatabaseMetadata: true,
        includeGraphAnalysis: true,
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
      <h1>Stats</h1>
      {
        status === "READY"
          ? <>
            <h2>Database</h2>
            <table className="data-table stats-table">
              <tbody>
                <tr>
                  <td>ID</td>
                  <td>{stats.dbId}</td>
                </tr>
                <tr>
                  <td>Type</td>
                  <td>{databaseProvider.constructor.type}</td>
                </tr>
                <tr>
                  <td>Creation time</td>
                  <td>{makeTimestampHumanReadable(stats.dbCreationTime)}</td>
                </tr>
                <tr>
                  <td>Update time</td>
                  <td>{makeTimestampHumanReadable(stats.dbUpdateTime)}</td>
                </tr>
                <tr>
                  <td>Size of main data</td>
                  <td>{humanFileSize(stats.dbSize.mainData)}</td>
                </tr>
                <tr>
                  <td>Size of all files</td>
                  <td>{humanFileSize(stats.dbSize.files)}</td>
                </tr>
                <tr>
                  <td>
                    {emojis.document}{emojis.image}{emojis.audio}{emojis.video}
                    <span> </span>Number of files
                  </td>
                  <td>{stats.numberOfFiles.toLocaleString("en")}</td>
                </tr>
                <tr>
                  <td>{emojis.pin} Pins</td>
                  <td>{stats.numberOfPins.toLocaleString("en")}</td>
                </tr>
              </tbody>
            </table>
            <h2>Graph</h2>
            <table className="data-table stats-table">
              <tbody>
                <tr>
                  <td>{emojis.note} Notes</td>
                  <td>{stats.numberOfAllNotes.toLocaleString("en")}</td>
                </tr>
                <tr>
                  <td>{emojis.link} Links</td>
                  <td>{stats.numberOfLinks.toLocaleString("en")}</td>
                </tr>
                <tr>
                  <td>{emojis.unlinked} Unlinked notes</td>
                  <td>{
                    stats.numberOfUnlinkedNotes.toLocaleString("en")
                    + ` (${percentageOfUnlinkedNotes.toLocaleString("en")} %)`
                  }</td>
                </tr>
                <tr>
                  <td><a
                    href="https://en.wikipedia.org/wiki/Component_(graph_theory)"
                    target="_blank"
                    rel="noreferrer noopener"
                  >Components</a></td>
                  <td>{stats.numberOfComponents.toLocaleString("en")}</td>
                </tr>
                <tr>
                  <td>Components with more than one node</td>
                  <td>{
                    stats.numberOfComponentsWithMoreThanOneNode
                      .toLocaleString("en")
                  }</td>
                </tr>
                <tr>
                  <td>{emojis.hub} Hubs (nodes with more than 4 links)</td>
                  <td>{
                    stats.numberOfHubs.toLocaleString("en")
                  }</td>
                </tr>
                <tr>
                  <td>🔥 Nodes with highest number of links</td>
                  <td>
                    {
                      stats.nodesWithHighestNumberOfLinks.map((note) => {
                        return <p
                          key={`stats_nodesWithHighesNumberOfLinks_${note.id}`}
                          style={{
                            "margin": "0",
                          }}
                        >
                          <a href={
                            paths.editorWithNote.replace("%NOTE_ID%", note.id)
                          }>
                            {note.title}
                          </a> ({note.numberOfLinkedNotes.toLocaleString("en")})
                        </p>;
                      })
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
