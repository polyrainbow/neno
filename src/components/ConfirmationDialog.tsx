import Dialog from "./Dialog";
import DialogActionBar from "./DialogActionBar";

export interface ConfirmationDialogParams {
  text: string,
  confirmText: string,
  cancelText: string,
  encourageConfirmation: boolean,
}

interface ConfirmationDialogProps {
  onConfirm: () => void;
  onCancel: () => void;
  params?: ConfirmationDialogParams;
}

const ConfirmationDialog = ({
  params,
  onConfirm,
  onCancel,
}: ConfirmationDialogProps) => {
  if (!params) return null;

  const {
    text,
    confirmText,
    cancelText,
    encourageConfirmation,
  } = params;

  return <Dialog
    onClickOnOverlay={onCancel}
  >
    <p
      className="dialog-text"
    >{text}</p>
    <DialogActionBar>
      <button
        onClick={onConfirm}
        autoFocus={encourageConfirmation}
        className={
          "default-button dialog-box-button "
          + (encourageConfirmation ? "default-action" : "dangerous-action")
        }
      >{confirmText}</button>
      <button
        onClick={onCancel}
        autoFocus={!encourageConfirmation}
        className={
          "default-button dialog-box-button "
          + (!encourageConfirmation ? "default-action" : "")
        }
      >{cancelText}</button>
    </DialogActionBar>
  </Dialog>;
};

export default ConfirmationDialog;
