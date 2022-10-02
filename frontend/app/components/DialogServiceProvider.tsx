import React, { useEffect } from "react";
import DialogServiceContext from "../contexts/DialogServiceContext";
import { DialogType } from "../enum/DialogType";
import DialogServiceConfiguration
  from "../interfaces/DialogServiceConfiguration";
import ChangeLanguageDialog from "./ChangeLanguageDialog";
import ExportDatabaseDialog from "./ExportDatabaseDialog";
import ImportLinksDialog from "./CreateOneNotePerLineDialog";
import SwitchGraphsDialog from "./SwitchGraphsDialog";
import * as Localizer from "../lib/intl";

/*
  This component renders a dialog when another component opens it via the
  useDialog() hook.
  It must be inserted into the component tree above all components that use
  the useDialog() hook.
*/
const DialogServiceProvider = (props) => {
  /*
    In this state, we save the currently opened dialog and the callback that
    should be executed when the dialog requests it.
  */
  const [
    config,
    setConfig,
  ] = React.useState<DialogServiceConfiguration>({
    openDialog: DialogType.NONE,
    callback: null,
  });

  const resetDialogConfig = () => {
    setConfig({
      openDialog: DialogType.NONE,
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
    {
      config.openDialog === DialogType.EXPORT_DATABASE
        ? <ExportDatabaseDialog
          databaseProvider={props.databaseProvider}
          onClose={resetDialogConfig}
        />
        : null
    }
    {
      config.openDialog === DialogType.CREATE_ONE_NOTE_PER_LINE
        ? <ImportLinksDialog
          createOneNotePerLine={config.callback}
          onClose={resetDialogConfig}
        />
        : null
    }
    {
      config.openDialog === DialogType.SWITCH_GRAPHS
        ? <SwitchGraphsDialog
          activeGraphId={props.databaseProvider.getActiveGraphId()}
          graphIds={props.databaseProvider.getGraphIds()}
          switchGraphs={config.callback}
          onClose={resetDialogConfig}
        />
        : null
    }
    {
      config.openDialog === DialogType.CHANGE_LANGUAGE
        ? <ChangeLanguageDialog
          activeLanguage={Localizer.getActiveLanguage()}
          languages={Localizer.supportedLangs}
          changeLanguage={config.callback}
          onClose={resetDialogConfig}
        />
        : null
    }
  </>;
};

export default DialogServiceProvider;
