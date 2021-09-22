import React from "react";
import AppMenuItem from "./AppMenuItem";
import * as Config from "./lib/config.js";
import ConfirmationServiceContext from "./ConfirmationServiceContext.js";
import OutsideAlerter from "./OutsideAlerter.js";
import {
  useHistory,
  useLocation,
} from "react-router-dom";
import useIsSmallScreen from "./hooks/useIsSmallScreen.js";

const AppMenu = ({
  openExportDatabaseDialog,
  onClose,
  unsavedChanges,
  setUnsavedChanges,
  showStats,
  databaseProvider,
}) => {
  const confirm = React.useContext(ConfirmationServiceContext) as (any) => void;

  const location = useLocation();
  const history = useHistory();
  const isSmallScreen = useIsSmallScreen();

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
        location.pathname.startsWith(Config.paths.editor)
        || location.pathname.startsWith(Config.paths.list)
          ? <AppMenuItem
            label="Show graph"
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
              history.push(Config.paths.graph);
            }}
          />
          : ""
      }
      {
        location.pathname.startsWith(Config.paths.graph)
          ? <AppMenuItem
            label={isSmallScreen ? "Go to list" : "Go to editor"}
            icon={isSmallScreen ? "list" : "create"}
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
              history.push(
                isSmallScreen ? Config.paths.list : Config.paths.editor,
              );
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
          location.pathname.startsWith(Config.paths.editor)
          || location.pathname.startsWith(Config.paths.graph)
          || location.pathname.startsWith(Config.paths.list)
        )
          ? <AppMenuItem
            label="Logout"
            icon="lock"
            onClick={async () => {
              if (unsavedChanges) {
                await confirm({
                  text: Config.texts.discardChangesConfirmation,
                  confirmText: "Discard changes",
                  cancelText: "Cancel",
                  encourageConfirmation: false,
                });
              }

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
