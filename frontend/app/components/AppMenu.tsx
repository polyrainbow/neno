import React, { useContext } from "react";
import AppMenuItem from "./AppMenuItem";
import OutsideAlerter from "./OutsideAlerter";
import { DialogType } from "../enum/DialogType";
import useDialog from "../hooks/useDialog";
import { l, setLanguage } from "../lib/intl";
import AppMenuContext from "../contexts/AppMenuContext";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import { getAppPath } from "../lib/utils";
import { PathTemplate } from "../enum/PathTemplate";
import UnsavedChangesContext from "../contexts/UnsavedChangesContext";
import useConfirmDiscardingUnsavedChangesDialog
  from "../hooks/useConfirmDiscardingUnsavedChangesDialog";
import { GraphId } from "../../../lib/notes/interfaces/GraphId";
import useDatabaseControl from "../hooks/useDatabaseControl";
import { DatabaseMode } from "../enum/DatabaseMode";


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

  const databaseControl = useDatabaseControl();

  const databaseProvider
    = databaseControl.databaseModeRef.current === DatabaseMode.LOCAL
      ? databaseControl.localDatabaseProvider
      : (
        databaseControl.databaseModeRef.current === DatabaseMode.SERVER
          ? databaseControl.serverDatabaseProvider
          : null
      );

  const { graphId } = useParams();

  const openChangeLanguageDialog = useDialog(
    DialogType.CHANGE_LANGUAGE,
    null,
    setLanguage,
  );


  const switchGraphs = (graphId: GraphId): void => {
    navigate(getAppPath(
      isSmallScreen ? PathTemplate.LIST : PathTemplate.NEW_NOTE,
      new Map([["GRAPH_ID", graphId]]),
    ));
    // we need to do a manual reload via native browser apis here because
    // navigate() does not work as <DialogServiceProvider /> is
    // not mounted within <AppRouter />
    window.location.reload();
  };

  const openSwitchGraphsDialog = useDialog(
    DialogType.SWITCH_GRAPHS,
    { graphId },
    switchGraphs,
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
        disabled={!(databaseProvider && graphId)}
        label={isSmallScreen ? l("menu.note-list") : l("menu.editor")}
        icon={isSmallScreen ? "list" : "create"}
        onClick={async () => {
          if (!graphId) return;

          const target = getAppPath(
            isSmallScreen
              ? PathTemplate.LIST
              : PathTemplate.NEW_NOTE,
            new Map([["GRAPH_ID", graphId]]),
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
        disabled={!(databaseProvider && graphId)}
        label={l("menu.graph")}
        icon="scatter_plot"
        onClick={async () => {
          if (!graphId) return;

          const target = getAppPath(
            PathTemplate.GRAPH,
            new Map([["GRAPH_ID", graphId]]),
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
        disabled={!(databaseProvider && graphId)}
        label={l("menu.files")}
        icon="grid_view"
        onClick={async () => {
          if (!graphId) return;

          const target = getAppPath(
            PathTemplate.FILES,
            new Map([["GRAPH_ID", graphId]]),
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
        disabled={!(databaseProvider && graphId)}
        label={l("menu.stats")}
        icon="query_stats"
        onClick={async () => {
          if (!graphId) return;

          const target = getAppPath(
            PathTemplate.STATS,
            new Map([["GRAPH_ID", graphId]]),
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
        disabled={!(databaseProvider && graphId)}
        label={l("menu.settings")}
        icon="settings"
        onClick={async () => {
          if (!graphId) return;

          const target = getAppPath(
            PathTemplate.SETTINGS,
            new Map([["GRAPH_ID", graphId]]),
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
          window.location.reload();
        }}
      />
    </div>
  </OutsideAlerter>;
};

export default AppMenu;
