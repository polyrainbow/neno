import React from "react";
import { ConfirmationDialogParams } from "../components/ConfirmationDialog";

type ConfirmationServiceContextType
  = ((params: ConfirmationDialogParams) => Promise<void>) | null;

const ConfirmationServiceContext
  = React.createContext<ConfirmationServiceContextType>(null);

export default ConfirmationServiceContext;
