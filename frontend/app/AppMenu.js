import React from "react";
import AppMenuItem from "./AppMenuItem.js";
import * as tokenManager from "./lib/tokenManager.js";
import * as Config from "./lib/config.js";
import ConfirmationServiceContext from "./ConfirmationServiceContext.js";

const AppMenu = ({
  setActiveView,
  activeView,
  openExportDatabaseDialog,
  onClose,
  unsavedChanges,
  setUnsavedChanges,
}) => {
  const confirm = React.useContext(ConfirmationServiceContext);

  return <div
    id="app-menu"
    style={{
      "position": "fixed",
      "top": "50px",
      "left": "0px",
    }}
    onClick={
      onClose
    }
  >
    {
      activeView === "EDITOR"
        ? <AppMenuItem
          label="Switch to Graph view"
          icon="scatter_plot"
          onClick={async () => {
            if (unsavedChanges) {
              await confirm({
                text: Config.texts.discardChangesConfirmation,
                confirmText: "Discard changes",
                cancelText: "Cancel",
                encourageConfirmation: false,
              });
            }

            setUnsavedChanges(false);
            setActiveView("GRAPH");
          }}
        />
        : ""
    }
    {
      activeView === "GRAPH"
        ? <AppMenuItem
          label="Switch to editor view"
          icon="create"
          onClick={async () => {
            if (unsavedChanges) {
              await confirm({
                text: Config.texts.discardChangesConfirmation,
                confirmText: "Discard changes",
                cancelText: "Cancel",
                encourageConfirmation: false,
              });
            }

            setUnsavedChanges(false);
            setActiveView("EDITOR");
          }}
        />
        : ""
    }
    <AppMenuItem
      label="Export database"
      icon="archive"
      onClick={openExportDatabaseDialog}
    />
    {
      tokenManager.get()
        ? <AppMenuItem
          id="button_logout"
          label="Logout"
          icon="lock"
          onClick={() => {
            tokenManager.remove();
            setActiveView("LOGIN");
          }}
        />
        : ""
    }
  </div>;
};

export default AppMenu;
