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

        // @ts-ignore
        navigation.navigate(getAppPath(PathTemplate.START));
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

        // @ts-ignore
        navigation.navigate(target);
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

        // @ts-ignore
        navigation.navigate(target);
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

        // @ts-ignore
        navigation.navigate(target);
      }}
    />
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

        // @ts-ignore
        navigation.navigate(target);
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

        // @ts-ignore
        navigation.navigate(target);
      }}
    />
  </div>;
};

export default NavigationRail;
