import React, { useState } from "react";
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
        onClose();
      }}
      className="default-button dialog-box-button default-action"
    >Switch</button>
    <button
      onClick={onClose}
      className="default-button dialog-box-button"
    >Cancel</button>
  </Dialog>;
};

export default SwitchGraphsDialog;
