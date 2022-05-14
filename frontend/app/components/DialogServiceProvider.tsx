import React, { useEffect } from "react";
import DialogServiceContext from "../contexts/DialogServiceContext";
import { DialogType } from "../enum/DialogType";
import DialogServiceConfiguration
  from "../interfaces/DialogServiceConfiguration";
import ExportDatabaseDialog from "./ExportDatabaseDialog";
import ImportLinksDialog from "./ImportLinksDialog";
import SearchDialog from "./SearchDialog";
import SwitchGraphsDialog from "./SwitchGraphsDialog";

const DialogServiceProvider = (props) => {
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
      config.openDialog === DialogType.IMPORT_LINKS
        ? <ImportLinksDialog
          importLinksAsNotes={config.callback}
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
      config.openDialog === DialogType.SEARCH
        ? <SearchDialog
          setSearchValue={config.callback}
          onClose={resetDialogConfig}
        />
        : null
    }
  </>;
};

export default DialogServiceProvider;
