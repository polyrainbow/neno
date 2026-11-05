import { useSyncExternalStore } from "react";
import { getSyncStatus, subscribeSyncStatus } from "../lib/syncStatus";
import { SyncStatus } from "../lib/git/types";

/** Null outside the desktop app, and when git is not installed. */
const useSyncStatus = (): SyncStatus | null =>
  useSyncExternalStore(subscribeSyncStatus, getSyncStatus);

export default useSyncStatus;
