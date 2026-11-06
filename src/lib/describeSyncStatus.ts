import { SyncStatus } from "./git/types";
import { l } from "./intl";

/*
  Where sync stands, as an icon and one line. An unreachable remote reads
  as a plain fact: it is the normal state of a LAN-only remote on the
  road.
*/
export const describeSyncStatus = (
  status: SyncStatus,
): { icon: string; label: string } => {
  const count = String(status.unpushedCommits);
  if (status.state === "error") {
    return { icon: "warning", label: l("sync.state.error") };
  }
  if (status.state === "syncing") {
    return { icon: "cached", label: l("sync.state.syncing") };
  }
  if (status.state === "offline") {
    return { icon: "link_off", label: l("sync.state.offline", { count }) };
  }
  if (status.unpushedCommits > 0) {
    return { icon: "file_upload", label: l("sync.state.waiting", { count }) };
  }
  return { icon: "done", label: l("sync.state.synced") };
};
