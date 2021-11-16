import React from "react";
import AppMenuItem from "./AppMenuItem";
import * as Config from "./lib/config";
import OutsideAlerter from "./OutsideAlerter";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";
import useIsSmallScreen from "./hooks/useIsSmallScreen";
import useConfirmDiscardingUnsavedChangesDialog
  from "./hooks/useConfirmDiscardingUnsavedChangesDialog";

const AppMenu = ({
  openExportDatabaseDialog,
  onClose,
  unsavedChanges,
  setUnsavedChanges,
  databaseProvider,
}) => {
  const confirmDiscardingUnsavedChanges
    = useConfirmDiscardingUnsavedChangesDialog();

  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
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
      <AppMenuItem
        label={isSmallScreen ? "Note list" : "Editor"}
        icon={isSmallScreen ? "list" : "create"}
        onClick={async () => {
          const target = isSmallScreen
            ? Config.paths.list
            : Config.paths.editorWithNewNote;

          if (pathname === target) return;

          if (unsavedChanges) {
            await confirmDiscardingUnsavedChanges();
            setUnsavedChanges(false);
          }

          navigate(target);
        }}
      />
      <AppMenuItem
        label="Graph"
        icon="scatter_plot"
        onClick={async () => {
          const target = Config.paths.graph;
          if (pathname === target) return;

          if (unsavedChanges) {
            await confirmDiscardingUnsavedChanges();
            setUnsavedChanges(false);
          }
          navigate(target);
        }}
      />
      <AppMenuItem
        label="Stats"
        icon="query_stats"
        onClick={async () => {
          const target = Config.paths.stats;
          if (pathname === target) return;

          if (unsavedChanges) {
            await confirmDiscardingUnsavedChanges();
            setUnsavedChanges(false);
          }
          navigate(target);
        }}
      />
      {
        databaseProvider.constructor.features.includes("EXPORT_DATABASE")
          ? <AppMenuItem
            label="Export database"
            icon="archive"
            onClick={openExportDatabaseDialog}
          />
          : null
      }
      <AppMenuItem
        label="Logout"
        icon="lock"
        onClick={async () => {
          if (unsavedChanges) {
            await confirmDiscardingUnsavedChanges();
            setUnsavedChanges(false);
          }

          await databaseProvider.removeAccess();
          navigate(Config.paths.login);
        }}
      />
    </div>
  </OutsideAlerter>;
};

export default AppMenu;
