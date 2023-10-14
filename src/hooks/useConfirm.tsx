import * as React from "react";
import ConfirmationServiceContext
  from "../contexts/ConfirmationServiceContext";

const useConfirm = () => {
  const confirm = React.useContext(
    ConfirmationServiceContext,
  );

  if (!confirm) {
    throw new Error(
      "ConfirmationServiceContext is not initialized",
    );
  }

  return confirm;
};

export default useConfirm;
