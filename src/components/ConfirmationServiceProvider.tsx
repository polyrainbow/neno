import React, { useEffect } from "react";
import ConfirmationDialog, {
  ConfirmationDialogParams,
} from "./ConfirmationDialog";
import ConfirmationServiceContext from "../contexts/ConfirmationServiceContext";

const ConfirmationServiceProvider = ({
  children,
}: React.PropsWithChildren) => {
  const [
    confirmationState,
    setConfirmationState,
  ] = React.useState<any>(null);

  const awaitingPromiseRef = React.useRef<any>();

  const openConfirmation = (params: ConfirmationDialogParams) => {
    setConfirmationState(params);
    return new Promise((resolve, reject) => {
      awaitingPromiseRef.current = { resolve, reject };
    });
  };

  const handleCancel = () => {
    if (!confirmationState) {
      return;
    }

    if (confirmationState.catchOnCancel && awaitingPromiseRef.current) {
      awaitingPromiseRef.current.reject();
    }

    setConfirmationState(null);
  };

  const handleConfirm = () => {
    if (awaitingPromiseRef.current) {
      awaitingPromiseRef.current.resolve();
    }

    setConfirmationState(null);
  };

  /* close dialog on Escape press */
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleCancel();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [confirmationState]);

  return <>
    <ConfirmationDialog
      params={confirmationState}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
    <ConfirmationServiceContext.Provider
      // @ts-ignore
      value={openConfirmation}
    >
      {children}
    </ConfirmationServiceContext.Provider>
  </>;
};

export default ConfirmationServiceProvider;
