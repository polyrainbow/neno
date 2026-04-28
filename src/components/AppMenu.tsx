import { useContext, useState } from "react";
import AppMenuItem from "./AppMenuItem";
import { l } from "../lib/intl";
import useIsSmallScreen from "../hooks/useIsSmallScreen";
import { getAppPath } from "../lib/utils";
import { PathTemplate } from "../types/PathTemplate";
import UnsavedChangesContext from "../contexts/UnsavedChangesContext";
import useConfirmDiscardingUnsavedChangesDialog
  from "../hooks/useConfirmDiscardingUnsavedChangesDialog";
import { isInitialized } from "../lib/LocalDataStorage";
import { LOCAL_GRAPH_ID } from "../config";
import { navigateTo } from "../lib/navigation";

/*
  Closing the app menu after calling navigate() is essential.
  Before, we had the close app menu handler on the div.app-menu,
  but this led to the navigate() call not having any effect, as it was not
  followed by a state change.
*/

interface AppMenuProps {
  ref: React.RefObject<HTMLDialogElement | null>,
  onSelect: () => void,
}

const AppMenu = ({ ref, onSelect }: AppMenuProps) => {
  const [
    isAppMenuOpen,
    setIsAppMenuOpen,
  ] = useState<boolean>(true);

  const [unsavedChanges, setUnsavedChanges]
    = useContext(UnsavedChangesContext);

  const pathname = location.pathname;
  const isSmallScreen = useIsSmallScreen();
  const confirmDiscardingUnsavedChanges
    = useConfirmDiscardingUnsavedChangesDialog();

  if (!isAppMenuOpen) return null;

  return <dialog
    className="app-menu"
    ref={ref}
    id="app-menu"
  >
    <AppMenuItem
      disabled={false}
      label={l("menu.launchpad")}
      icon="rocket_launch"
      onClick={async () => {
        onSelect();

        if (unsavedChanges) {
          await confirmDiscardingUnsavedChanges();
          setUnsavedChanges(false);
        }

        navigateTo(getAppPath(PathTemplate.START));
        setIsAppMenuOpen(false);
      }}
    />
    <AppMenuItem
      disabled={!isInitialized()}
      label={isSmallScreen ? l("menu.note-list") : l("menu.editor")}
      icon={isSmallScreen ? "list" : "create"}
      onClick={async () => {
        onSelect();

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
        setIsAppMenuOpen(false);
      }}
    />
    <AppMenuItem
      disabled={!isInitialized()}
      label={l("menu.files")}
      icon="grid_view"
      onClick={async () => {
        onSelect();

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
        setIsAppMenuOpen(false);
      }}
    />
    <AppMenuItem
      disabled={!isInitialized()}
      label={l("menu.stats")}
      icon="query_stats"
      onClick={async () => {
        onSelect();

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
        setIsAppMenuOpen(false);
      }}
    />
    <AppMenuItem
      disabled={false}
      label={l("menu.settings")}
      icon="settings"
      onClick={async () => {
        onSelect();

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
        setIsAppMenuOpen(false);
      }}
    />
  </dialog>;
};

export default AppMenu;
