import React from "react";
import AppMenuItem from "./AppMenuItem";
import OutsideAlerter from "./OutsideAlerter";
import {
  useNavigate,
  useLocation,
} from "react-router-dom";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import useConfirmDiscardingUnsavedChangesDialog
  from "../hooks/useConfirmDiscardingUnsavedChangesDialog";
import { getAppPath } from "../lib/utils";
import { PathTemplate } from "../enum/PathTemplate";
import { DialogType } from "../enum/DialogType";
import useDialog from "../hooks/useDialog";

const AppMenu = ({
  importLinksAsNotes,
  switchGraphs,
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

  const openImportLinksDialog = useDialog(
    DialogType.IMPORT_LINKS,
    importLinksAsNotes,
  );


  const openSwitchGraphsDialog = useDialog(
    DialogType.SWITCH_GRAPHS,
    switchGraphs,
  );

  const openExportDatabaseDialog = useDialog(
    DialogType.EXPORT_DATABASE,
    null,
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
      <AppMenuItem
        label={isSmallScreen ? "Note list" : "Editor"}
        icon={isSmallScreen ? "list" : "create"}
        onClick={async () => {
          const target = isSmallScreen
            ? getAppPath(PathTemplate.LIST)
            : getAppPath(PathTemplate.EDITOR_WITH_NEW_NOTE);

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
          const target = getAppPath(PathTemplate.GRAPH);
          if (pathname === target) return;

          if (unsavedChanges) {
            await confirmDiscardingUnsavedChanges();
            setUnsavedChanges(false);
          }
          navigate(target);
        }}
      />
      <AppMenuItem
        label="Files"
        icon="grid_view"
        onClick={async () => {
          const target = getAppPath(PathTemplate.FILES);
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
          const target = getAppPath(PathTemplate.STATS);
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
        label="Import links as notes"
        icon="dynamic_feed"
        onClick={openImportLinksDialog}
      />
      <AppMenuItem
        label="Switch graphs"
        icon="cached"
        onClick={openSwitchGraphsDialog}
      />
      <AppMenuItem
        label="Logout"
        icon="lock"
        onClick={async () => {
          if (unsavedChanges) {
            await confirmDiscardingUnsavedChanges();
            setUnsavedChanges(false);
          }

          await databaseProvider.removeAccess();
          navigate(getAppPath(PathTemplate.LOGIN));
        }}
      />
    </div>
  </OutsideAlerter>;
};

export default AppMenu;
