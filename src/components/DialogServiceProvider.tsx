import React, { useEffect } from "react";
import DialogServiceContext from "../contexts/DialogServiceContext";
import { DialogType } from "../enum/DialogType";
import DialogServiceConfiguration
  from "../types/DialogServiceConfiguration";
import NotesProvider from "../lib/notes";

interface DialogServiceProviderProps {
  databaseProvider: NotesProvider | null,
  children: React.ReactNode[] | React.ReactNode,
}

/*
  This component renders a dialog when another component opens it via the
  useDialog() hook.
  It must be inserted into the component tree above all components that use
  the useDialog() hook.
*/
const DialogServiceProvider = (props: DialogServiceProviderProps) => {
  /*
    In this state, we save the currently opened dialog and the callback that
    should be executed when the dialog requests it.
  */
  const [
    config,
    setConfig,
  ] = React.useState<DialogServiceConfiguration>({
    openDialog: DialogType.NONE,
    props: null,
    callback: null,
  });

  const resetDialogConfig = () => {
    setConfig({
      openDialog: DialogType.NONE,
      props: null,
      callback: null,
    });
  };

  /* close dialogs on Escape press */
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === "Escape") {
        resetDialogConfig();
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [config.openDialog]);


  return <>
    <DialogServiceContext.Provider
      value={setConfig}
    >
      {props.children}
    </DialogServiceContext.Provider>
  </>;
};

export default DialogServiceProvider;
