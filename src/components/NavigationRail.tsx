import { useContext } from "react";
import NavigationRailItem from "./NavigationRailItem";
import { l } from "../lib/intl";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import { getAppPath } from "../lib/utils";
import { PathTemplate } from "../types/PathTemplate";
import UnsavedChangesContext from "../contexts/UnsavedChangesContext";
import useConfirmDiscardingUnsavedChangesDialog
  from "../hooks/useConfirmDiscardingUnsavedChangesDialog";
import { isInitialized } from "../lib/LocalDataStorage";
import { LOCAL_GRAPH_ID } from "../config";
import useGitEnabled from "../hooks/useGitEnabled";
import { navigateTo } from "../lib/navigation";

interface NavigationRailProps {
  activeView: string,
}

const NavigationRail = ({
  activeView,
}: NavigationRailProps) => {
  const [unsavedChanges, setUnsavedChanges]
    = useContext(UnsavedChangesContext);

  const pathname = location.pathname;
  const isSmallScreen = useIsSmallScreen();
  const confirmDiscardingUnsavedChanges
    = useConfirmDiscardingUnsavedChangesDialog();
  const gitEnabled = useGitEnabled();

  return <div className="navigation-rail">
    <NavigationRailItem
      isActive={activeView === "launchpad"}
      id="launchpad"
      disabled={false}
      label={l("menu.launchpad")}
      icon="rocket_launch"
      onClick={async () => {
        if (unsavedChanges) {
          await confirmDiscardingUnsavedChanges();
          setUnsavedChanges(false);
        }

        navigateTo(getAppPath(PathTemplate.START));
      }}
    />
    <NavigationRailItem
      isActive={["notes", "list"].includes(activeView)}
      id="note-view"
      disabled={!isInitialized()}
      label={isSmallScreen ? l("menu.note-list") : l("menu.editor")}
      icon={isSmallScreen ? "list" : "edit"}
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

        navigateTo(target);
      }}
    />
    <NavigationRailItem
      isActive={activeView === "files"}
      id="files-view"
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

        navigateTo(target);
      }}
    />
    <NavigationRailItem
      isActive={activeView === "scripting"}
      id="scripting-view"
      disabled={!isInitialized()}
      label={l("menu.scripting")}
      icon="bolt"
      onClick={async () => {
        const target = getAppPath(
          PathTemplate.SCRIPTING,
          new Map([["GRAPH_ID", LOCAL_GRAPH_ID]]),
        );
        if (pathname === target) return;

        if (unsavedChanges) {
          await confirmDiscardingUnsavedChanges();
          setUnsavedChanges(false);
        }

        navigateTo(target);
      }}
    />
    {gitEnabled && <NavigationRailItem
      isActive={activeView === "history"}
      id="history-view"
      disabled={!isInitialized()}
      label={l("menu.history")}
      icon="history"
      onClick={async () => {
        const target = getAppPath(
          PathTemplate.HISTORY,
          new Map([["GRAPH_ID", LOCAL_GRAPH_ID]]),
        );
        if (pathname === target) return;

        if (unsavedChanges) {
          await confirmDiscardingUnsavedChanges();
          setUnsavedChanges(false);
        }

        navigateTo(target);
      }}
    />}
    <NavigationRailItem
      isActive={activeView === "stats"}
      id="stats-view"
      disabled={!isInitialized()}
      label={l("stats.graph-stats")}
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

        navigateTo(target);
      }}
    />
    <NavigationRailItem
      isActive={activeView === "settings"}
      id="settings-view"
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

        navigateTo(target);
      }}
    />
  </div>;
};

export default NavigationRail;
