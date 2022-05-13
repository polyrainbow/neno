import React, { useState } from "react";
import Dialog from "./Dialog";

const SwitchGraphsDialog = ({
  activeGraphId,
  graphIds,
  switchGraphs,
  onCancel,
}) => {
  const [selectedGraphId, setSelectedGraphId] = useState(activeGraphId);

  return <Dialog
    onClickOnOverlay={onCancel}
    className="import-link-dialog"
  >
    <h1>Switch graphs</h1>
    <select
      value={selectedGraphId}
      onChange={(e) => setSelectedGraphId(e.target.value)}
      style={{ width: "100%" }}
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
      }}
      className="default-button dialog-box-button default-action"
    >Switch</button>
    <button
      onClick={onCancel}
      className="default-button dialog-box-button"
    >Cancel</button>
  </Dialog>;
};

export default SwitchGraphsDialog;
