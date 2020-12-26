import React from "react";
import ConfirmationDialog from "./ConfirmationDialog.js";
import ConfirmationServiceContext from "./ConfirmationServiceContext.js";

const ConfirmationServiceProvider = ({
  children,
}) => {
  const [
    confirmationState,
    setConfirmationState,
  ] = React.useState(null);

  const awaitingPromiseRef = React.useRef();

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
      value={openConfirmation}
    >
      {children}
    </ConfirmationServiceContext.Provider>
  </>;
};

export default ConfirmationServiceProvider;
