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
  showStats,
  databaseProvider,
}) => {
  const confirmDiscardingUnsavedChanges
    = useConfirmDiscardingUnsavedChangesDialog();

  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const isSmallScreen = useIsSmallScreen();

  const showGraphButton:boolean
    = pathname.startsWith(Config.paths.editor)
    || pathname.startsWith(Config.paths.list);

  const showNoteListOrEditorButton:boolean
    = pathname.startsWith(Config.paths.graph);

  const showLogoutButton:boolean = (
    pathname.startsWith(Config.paths.editor)
    || pathname.startsWith(Config.paths.graph)
    || pathname.startsWith(Config.paths.list)
  );

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
        showGraphButton
          ? <AppMenuItem
            label="Graph"
            icon="scatter_plot"
            onClick={async () => {
              if (unsavedChanges) {
                await confirmDiscardingUnsavedChanges();
                setUnsavedChanges(false);
              }
              navigate(Config.paths.graph);
            }}
          />
          : null
      }
      {
        showNoteListOrEditorButton
          ? <AppMenuItem
            label={isSmallScreen ? "Note list" : "Editor"}
            icon={isSmallScreen ? "list" : "create"}
            onClick={async () => {
              if (unsavedChanges) {
                await confirmDiscardingUnsavedChanges();
                setUnsavedChanges(false);
              }

              navigate(
                isSmallScreen
                  ? Config.paths.list
                  : Config.paths.editorWithNewNote,
              );
            }}
          />
          : null
      }
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
        label="Stats"
        icon="query_stats"
        onClick={showStats}
      />
      {
        showLogoutButton
          ? <AppMenuItem
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
          : null
      }
    </div>
  </OutsideAlerter>;
};

export default AppMenu;
