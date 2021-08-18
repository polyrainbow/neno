import React from "react";
import AppMenuItem from "./AppMenuItem.js";
import * as Config from "./lib/config.js";
import ConfirmationServiceContext from "./ConfirmationServiceContext.js";
import OutsideAlerter from "./OutsideAlerter.js";
import {
  useHistory,
  useLocation,
} from "react-router-dom";

const AppMenu = ({
  openExportDatabaseDialog,
  onClose,
  unsavedChanges,
  setUnsavedChanges,
  showStats,
  databaseProvider,
}) => {
  const confirm = React.useContext(ConfirmationServiceContext);

  const location = useLocation();
  const history = useHistory();

  return <OutsideAlerter
    onOutsideClick={onClose}
  >
    <div
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
        location.pathname.startsWith("/editor")
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
              history.push("/graph");
            }}
          />
          : ""
      }
      {
        location.pathname.startsWith("/graph")
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
              history.push("/editor");
            }}
          />
          : ""
      }
      {
        databaseProvider.constructor.features.includes("EXPORT_DATABASE")
          ? <AppMenuItem
            label="Export database"
            icon="archive"
            onClick={openExportDatabaseDialog}
          />
          : ""
      }
      <AppMenuItem
        label="Show stats"
        icon="query_stats"
        onClick={showStats}
      />
      {
        (
          location.pathname.startsWith("/editor")
          || location.pathname.startsWith("/graph")
        )
          ? <AppMenuItem
            id="button_logout"
            label="Logout"
            icon="lock"
            onClick={async () => {
              await databaseProvider.removeAccess();
              history.push("/login");
            }}
          />
          : ""
      }
    </div>
  </OutsideAlerter>;
};

export default AppMenu;
