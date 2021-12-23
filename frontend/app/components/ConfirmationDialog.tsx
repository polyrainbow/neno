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
      style={{
        marginTop: "0px",
        fontSize: "24px",
      }}
    >{text}</p>
    <button
      onClick={onConfirm}
      className={
        "default-button dialog-box-button "
        + (encourageConfirmation ? "default-action" : "")
      }
    >{confirmText}</button>
    <button
      onClick={onCancel}
      className={
        "default-button dialog-box-button "
        + (!encourageConfirmation ? "default-action" : "")
      }
    >{cancelText}</button>
  </Dialog>;
};

export default ConfirmationDialog;
