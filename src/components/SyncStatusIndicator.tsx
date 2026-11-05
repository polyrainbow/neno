import IconButton from "./IconButton";
import useSyncStatus from "../hooks/useSyncStatus";
import { describeSyncStatus } from "../lib/describeSyncStatus";

interface SyncStatusIndicatorProps {
  /** Opens where the details are: the auto-sync setting. */
  onClick: () => void,
}

/*
  Where auto-sync stands, at the foot of the navigation rail. Renders
  nothing while auto-sync is off. The tooltip is set as HTML, so it only
  ever carries our own strings — git's messages are shown, as text, in
  the settings.
*/
const SyncStatusIndicator = ({ onClick }: SyncStatusIndicatorProps) => {
  const status = useSyncStatus();
  if (!status?.enabled) return null;
  const { icon, label } = describeSyncStatus(status);

  return <div
    className={`sync-status-indicator sync-state-${status.state}`}
  >
    <IconButton
      id="sync-status"
      icon={icon}
      title={label}
      onClick={onClick}
      navRailButton
    />
  </div>;
};

export default SyncStatusIndicator;
