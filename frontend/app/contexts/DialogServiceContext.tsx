import React, { Dispatch, SetStateAction } from "react";
import DialogServiceConfiguration
  from "../interfaces/DialogServiceConfiguration";

const DialogServiceContext
  = React
    .createContext<Dispatch<SetStateAction<DialogServiceConfiguration>> | null>(
    null,
  );

export default DialogServiceContext;
