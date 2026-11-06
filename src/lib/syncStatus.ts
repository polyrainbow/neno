/*
  The open folder's auto-sync status, mirrored from the Electron main
  process. One subscription to main for the whole app, however many
  components read it.
*/

import { SyncStatus } from "./git/types";
import { getBridge, isElectron } from "./electron/bridge";

let status: SyncStatus | null = null;
let started = false;
const listeners = new Set<() => void>();

const notify = (): void => {
  for (const listener of listeners) listener();
};

const adopt = (next: SyncStatus | null): void => {
  status = next;
  notify();
};

function start(): void {
  if (started || !isElectron()) return;
  started = true;
  const bridge = getBridge();
  bridge.onSyncStatus(adopt);
  void bridge.getSyncStatus().then(adopt);
  // A remote that was out of reach may be back: try now, not on schedule.
  window.addEventListener("online", () => {
    void bridge.syncNow();
  });
}

export const subscribeSyncStatus = (listener: () => void): () => void => {
  start();
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const getSyncStatus = (): SyncStatus | null => status;

/** Rejects with the reason when sync cannot be switched on. */
export const setAutoSync = async (enabled: boolean): Promise<void> => {
  adopt(await getBridge().setAutoSync(enabled));
};

export const syncNow = (): Promise<void> => getBridge().syncNow();
