import { useContext } from "react";
import AppMenuItem from "./AppMenuItem";
import OutsideAlerter from "./OutsideAlerter";
import { l } from "../lib/intl";
import AppMenuContext from "../contexts/AppMenuContext";
import { useLocation, useNavigate } from "react-router-dom";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import { getAppPath } from "../lib/utils";
import { PathTemplate } from "../types/PathTemplate";
import UnsavedChangesContext from "../contexts/UnsavedChangesContext";
import useConfirmDiscardingUnsavedChangesDialog
  from "../hooks/useConfirmDiscardingUnsavedChangesDialog";
import { isInitialized, removeAccess } from "../lib/LocalDataStorage";
import { LOCAL_GRAPH_ID } from "../config";

/*
  Closing the app menu after calling navigate() is essential.
  Before, we had the close app menu handler on the div.app-menu,
  but this led to the navigate() call not having any effect, as it was not
  followed by a state change.
*/

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

  if (!isAppMenuOpen) return null;

  return <OutsideAlerter
    onOutsideClick={() => setIsAppMenuOpen(false)}
  >
    <div className="app-menu">
      <AppMenuItem
        disabled={false}
        label={l("menu.launchpad")}
        icon="rocket_launch"
        onClick={async () => {
          if (unsavedChanges) {
            await confirmDiscardingUnsavedChanges();
            setUnsavedChanges(false);
          }

          await removeAccess();
          navigate(getAppPath(PathTemplate.START));
          setIsAppMenuOpen(false);
          window.location.reload();
        }}
      />
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

          navigate(target);
          setIsAppMenuOpen(false);
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
          setIsAppMenuOpen(false);
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
          setIsAppMenuOpen(false);
        }}
      />
      <AppMenuItem
        disabled={false}
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
          setIsAppMenuOpen(false);
        }}
      />
    </div>
  </OutsideAlerter>;
};

export default AppMenu;
