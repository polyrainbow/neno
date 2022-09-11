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
import { l, setLanguage } from "../lib/intl";
import DatabaseProvider from "../interfaces/DatabaseProvider";


interface AppMenuProps {
  createOneNotePerLine: (lines: string[]) => Promise<void>,
  switchGraphs,
  onClose,
  unsavedChanges: boolean,
  setUnsavedChanges: (boolean) => void,
  databaseProvider: DatabaseProvider | null,
  createNewNote,
}

const AppMenu = ({
  createOneNotePerLine,
  switchGraphs,
  onClose,
  unsavedChanges,
  setUnsavedChanges,
  databaseProvider,
  createNewNote,
}: AppMenuProps) => {
  const confirmDiscardingUnsavedChanges
    = useConfirmDiscardingUnsavedChangesDialog();

  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const isSmallScreen = useIsSmallScreen();

  const openCreateOneNotePerLineDialog = useDialog(
    DialogType.CREATE_ONE_NOTE_PER_LINE,
    createOneNotePerLine,
  );


  const openSwitchGraphsDialog = useDialog(
    DialogType.SWITCH_GRAPHS,
    switchGraphs,
  );

  const openExportDatabaseDialog = useDialog(
    DialogType.EXPORT_DATABASE,
    null,
  );

  const openChangeLanguageDialog = useDialog(
    DialogType.CHANGE_LANGUAGE,
    setLanguage,
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
        disabled={!databaseProvider}
        label={isSmallScreen ? l("menu.note-list") : l("menu.editor")}
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

          if (!isSmallScreen) {
            // we need to use force when calling createNewNote because
            // otherwise this function will ask again on unsaved changes.
            // this is because the setUnsavedChanges call above will be
            // scheduled and not executed immediately.
            createNewNote([], [], true);
          }

          navigate(target);
        }}
      />
      <AppMenuItem
        disabled={!databaseProvider}
        label={l("menu.graph")}
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
        disabled={!databaseProvider}
        label={l("menu.files")}
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
        disabled={!databaseProvider}
        label={l("menu.stats")}
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
      <AppMenuItem
        disabled={
          // @ts-ignore calling static property via class instance
          !databaseProvider?.constructor.features.includes("EXPORT_DATABASE")
        }
        label={l("menu.export-database")}
        icon="archive"
        onClick={openExportDatabaseDialog}
      />
      <AppMenuItem
        disabled={!databaseProvider}
        label={l("menu.create-one-note-per-line")}
        icon="dynamic_feed"
        onClick={openCreateOneNotePerLineDialog}
      />
      <AppMenuItem
        disabled={
          // @ts-ignore calling static property via class instance
          !databaseProvider?.constructor.features.includes("MULTIPLE_GRAPHS")
        }
        label={l("menu.switch-graphs")}
        icon="cached"
        onClick={openSwitchGraphsDialog}
      />
      <AppMenuItem
        label={l("menu.change-language")}
        icon="language"
        onClick={openChangeLanguageDialog}
      />
      <AppMenuItem
        disabled={!databaseProvider}
        label={l("menu.logout")}
        icon="lock"
        onClick={async () => {
          if (unsavedChanges) {
            await confirmDiscardingUnsavedChanges();
            setUnsavedChanges(false);
          }

          await databaseProvider?.removeAccess();
          navigate(getAppPath(PathTemplate.LOGIN));
        }}
      />
    </div>
  </OutsideAlerter>;
};

export default AppMenu;
