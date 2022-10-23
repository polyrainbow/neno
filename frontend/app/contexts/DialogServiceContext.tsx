import React, { Dispatch, SetStateAction } from "react";
import DialogServiceConfiguration
  from "../types/DialogServiceConfiguration";

const DialogServiceContext
  = React
    .createContext<Dispatch<SetStateAction<DialogServiceConfiguration>> | null>(
    null,
  );

export default DialogServiceContext;
