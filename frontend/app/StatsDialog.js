import React, { useState, useEffect } from "react";
import Dialog from "./Dialog.js";
import { emojis } from "./lib/config.js";

const StatsDialog = ({
  databaseProvider,
  onCancel,
}) => {
  const [stats, setStats] = useState(null);
  // status can be READY, BUSY
  const [status, setStatus] = useState("BUSY");

  useEffect(async () => {
    const stats = await databaseProvider.getStats(true);
    setStats(stats);
    setStatus("READY");
  }, []);

  return <Dialog
    onClickOnOverlay={() => {
      if (status !== "BUSY") onCancel();
    }}
    className="stats-dialog"
  >
    <h1>Stats</h1>
    {
      status === "READY"
        ? <table className="data-table stats-table">
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
              <td>{stats.numberOfUnlinkedNotes.toLocaleString("en")}</td>
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
                stats.numberOfComponentsWithMoreThanOneNode.toLocaleString("en")
              }</td>
            </tr>
            <tr>
              <td>{emojis.hub} Hubs (nodes with more than 4 links)</td>
              <td>{
                stats.numberOfHubs.toLocaleString("en")
              }</td>
            </tr>
            <tr>
              <td>🔥 Maximum number of links on a node</td>
              <td>{
                stats.maxNumberOfLinksOnANode.toLocaleString("en")
              }</td>
            </tr>
            <tr>
              <td>{emojis.image}{emojis.file} Files</td>
              <td>{stats.numberOfFiles.toLocaleString("en")}</td>
            </tr>
            <tr>
              <td>{emojis.pin} Pins</td>
              <td>{stats.numberOfPins.toLocaleString("en")}</td>
            </tr>
          </tbody>
        </table>
        : <p>Fetching stats...</p>
    }
    <button
      onClick={onCancel}
      className="default-button dialog-box-button default-action"
    >Close</button>
  </Dialog>;
};

export default StatsDialog;
