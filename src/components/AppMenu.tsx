import { useContext } from "react";
import AppMenuItem from "./AppMenuItem";
import OutsideAlerter from "./OutsideAlerter";
import { DialogType } from "../enum/DialogType";
import useDialog from "../hooks/useDialog";
import { l, setLanguage } from "../lib/intl";
import AppMenuContext from "../contexts/AppMenuContext";
import { useLocation, useNavigate } from "react-router-dom";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import { getAppPath } from "../lib/utils";
import { PathTemplate } from "../enum/PathTemplate";
import UnsavedChangesContext from "../contexts/UnsavedChangesContext";
import useConfirmDiscardingUnsavedChangesDialog
  from "../hooks/useConfirmDiscardingUnsavedChangesDialog";
import { isInitialized, removeAccess } from "../lib/LocalDataStorage";
import { LOCAL_GRAPH_ID } from "../config";


const AppMenu = () => {
  const {
    isAppMenuOpen,
    setIsAppMenuOpen,
  } = useContext(AppMenuContext);

  const [unsavedChanges, setUnsavedChanges]
    = useContext(UnsavedChangesContext);

  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();
  const isSmallScreen = useIsSmallScreen();
  const confirmDiscardingUnsavedChanges
    = useConfirmDiscardingUnsavedChangesDialog();

  const openChangeLanguageDialog = useDialog(
    DialogType.CHANGE_LANGUAGE,
    null,
    setLanguage,
  );


  if (!isAppMenuOpen) return null;

  return <OutsideAlerter
    onOutsideClick={() => setIsAppMenuOpen(false)}
  >
    <div
      className="app-menu"
      onClick={
        () => setIsAppMenuOpen(false)
      }
    >
      <AppMenuItem
        disabled={!isInitialized()}
        label={isSmallScreen ? l("menu.note-list") : l("menu.editor")}
        icon={isSmallScreen ? "list" : "create"}
        onClick={async () => {
          const target = getAppPath(
            isSmallScreen
              ? PathTemplate.LIST
              : PathTemplate.NEW_NOTE,
            new Map([["GRAPH_ID", LOCAL_GRAPH_ID]]),
          );

          if (pathname === target) return;

          if (unsavedChanges) {
            await confirmDiscardingUnsavedChanges();
            setUnsavedChanges(false);
          }

          /*
          if (!isSmallScreen) {
            // we need to use force when calling createNewNote because
            // otherwise this function will ask again on unsaved changes.
            // this is because the setUnsavedChanges call above will be
            // scheduled and not executed immediately.
            createNewNote([], [], true);
          }
          */

          navigate(target);
        }}
      />
      <AppMenuItem
        disabled={!isInitialized()}
        label={l("menu.graph")}
        icon="scatter_plot"
        onClick={async () => {
          const target = getAppPath(
            PathTemplate.GRAPH,
            new Map([["GRAPH_ID", LOCAL_GRAPH_ID]]),
          );
          if (pathname === target) return;

          if (unsavedChanges) {
            await confirmDiscardingUnsavedChanges();
            setUnsavedChanges(false);
          }
          navigate(target);
        }}
      />
      <AppMenuItem
        disabled={!isInitialized()}
        label={l("menu.files")}
        icon="grid_view"
        onClick={async () => {
          const target = getAppPath(
            PathTemplate.FILES,
            new Map([["GRAPH_ID", LOCAL_GRAPH_ID]]),
          );
          if (pathname === target) return;

          if (unsavedChanges) {
            await confirmDiscardingUnsavedChanges();
            setUnsavedChanges(false);
          }
          navigate(target);
        }}
      />
      <AppMenuItem
        disabled={!isInitialized()}
        label={l("menu.stats")}
        icon="query_stats"
        onClick={async () => {
          const target = getAppPath(
            PathTemplate.STATS,
            new Map([["GRAPH_ID", LOCAL_GRAPH_ID]]),
          );
          if (pathname === target) return;

          if (unsavedChanges) {
            await confirmDiscardingUnsavedChanges();
            setUnsavedChanges(false);
          }
          navigate(target);
        }}
      />
      <AppMenuItem
        disabled={!isInitialized()}
        label={l("menu.settings")}
        icon="settings"
        onClick={async () => {
          const target = getAppPath(
            PathTemplate.SETTINGS,
            new Map([["GRAPH_ID", LOCAL_GRAPH_ID]]),
          );
          if (pathname === target) return;

          if (unsavedChanges) {
            await confirmDiscardingUnsavedChanges();
            setUnsavedChanges(false);
          }
          navigate(target);
        }}
      />
      <AppMenuItem
        label={l("menu.change-language")}
        icon="language"
        onClick={openChangeLanguageDialog}
      />
      <AppMenuItem
        disabled={!isInitialized()}
        label={l("menu.close-graph")}
        icon="logout"
        onClick={async () => {
          if (unsavedChanges) {
            await confirmDiscardingUnsavedChanges();
            setUnsavedChanges(false);
          }

          await removeAccess();
          navigate(getAppPath(PathTemplate.LOGIN));
          window.location.reload();
        }}
      />
    </div>
  </OutsideAlerter>;
};

export default AppMenu;
