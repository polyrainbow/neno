import React from "react";
import ConfirmationDialog from "./ConfirmationDialog";
import ConfirmationServiceContext from "./ConfirmationServiceContext";

const ConfirmationServiceProvider = ({
  children,
}) => {
  const [
    confirmationState,
    setConfirmationState,
  ] = React.useState<any>(null);

  const awaitingPromiseRef = React.useRef<any>();

  const openConfirmation = (options) => {
    setConfirmationState(options);
    return new Promise((resolve, reject) => {
      awaitingPromiseRef.current = { resolve, reject };
    });
  };

  const handleCancel = () => {
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

  return <>
    <ConfirmationDialog
      isOpen={Boolean(confirmationState)}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
      {...confirmationState}
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
