import React, { useState } from "react";
import { l } from "../lib/intl";
import Dialog from "./Dialog";

const SwitchGraphsDialog = ({
  activeGraphId,
  graphIds,
  switchGraphs,
  onClose,
}) => {
  const [selectedGraphId, setSelectedGraphId] = useState(activeGraphId);

  return <Dialog
    onClickOnOverlay={onClose}
    className="switch-graphs-dialog"
  >
    <h1>{l("switch-graphs.heading")}</h1>
    <select
      value={selectedGraphId}
      onChange={(e) => setSelectedGraphId(e.target.value)}
    >
      {
        graphIds.map((graphId) => {
          return <option
            value={graphId}
            key={graphId}
          >{graphId}</option>;
        })
      }
    </select>
    <br/>
    <button
      onClick={() => {
        switchGraphs(selectedGraphId);
        onClose();
      }}
      className="default-button dialog-box-button default-action"
    >{l("switch-graphs.switch")}</button>
    <button
      onClick={onClose}
      className="default-button dialog-box-button"
    >{l("dialog.cancel")}</button>
  </Dialog>;
};

export default SwitchGraphsDialog;
