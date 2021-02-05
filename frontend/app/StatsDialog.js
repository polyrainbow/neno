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
        ? <table className="data-table">
          <tbody>
            <tr>
              <td>{emojis.note} Number of notes</td>
              <td>{stats.numberOfAllNotes.toLocaleString("en")}</td>
            </tr>
            <tr>
              <td>{emojis.link} Number of links</td>
              <td>{stats.numberOfLinks.toLocaleString("en")}</td>
            </tr>
            <tr>
              <td>{emojis.unlinked} Number of unlinked notes</td>
              <td>{stats.numberOfUnlinkedNotes.toLocaleString("en")}</td>
            </tr>
            <tr>
              <td>{emojis.image}{emojis.file} Number of files</td>
              <td>{stats.numberOfFiles.toLocaleString("en")}</td>
            </tr>
            <tr>
              <td>{emojis.pin} Number of pins</td>
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
