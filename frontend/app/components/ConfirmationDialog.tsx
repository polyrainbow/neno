import React from "react";
import Dialog from "./Dialog";

const ConfirmationDialog = ({
  isOpen,
  text,
  onConfirm,
  onCancel,
  confirmText,
  cancelText,
  encourageConfirmation,
}) => {
  if (!isOpen) return null;

  return <Dialog
    onClickOnOverlay={onCancel}
  >
    <p
      className="dialog-text"
    >{text}</p>
    <button
      onClick={onConfirm}
      autoFocus={encourageConfirmation}
      tabIndex={0}
      className={
        "default-button dialog-box-button "
        + (encourageConfirmation ? "default-action" : "dangerous-action")
      }
    >{confirmText}</button>
    <button
      onClick={onCancel}
      autoFocus={!encourageConfirmation}
      tabIndex={1}
      className={
        "default-button dialog-box-button "
        + (!encourageConfirmation ? "default-action" : "")
      }
    >{cancelText}</button>
  </Dialog>;
};

export default ConfirmationDialog;
