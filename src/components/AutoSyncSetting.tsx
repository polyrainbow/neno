import { useState } from "react";
import { l } from "../lib/intl";
import useSyncStatus from "../hooks/useSyncStatus";
import { setAutoSync, syncNow } from "../lib/syncStatus";
import { describeSyncStatus } from "../lib/describeSyncStatus";

const AutoSyncSetting = () => {
  const status = useSyncStatus();
  const [busy, setBusy] = useState(false);
  const [refusal, setRefusal] = useState<string | null>(null);

  if (!status) {
    return <section className="setting">
      <h2>{l("sync.heading")}</h2>
      <p>{l("sync.git-missing")}</p>
    </section>;
  }

  const toggle = async (enabled: boolean) => {
    setBusy(true);
    setRefusal(null);
    try {
      await setAutoSync(enabled);
    } catch (e) {
      setRefusal(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  const remote = status.remote
    ? `${status.remote.name}/${status.remote.branch}`
    : null;

  return <section className="setting">
    <h2>{l("sync.heading")}</h2>
    <p>{l("sync.description")}</p>
    {
      remote
        ? <p>
          <label>
            <input
              type="checkbox"
              checked={status.enabled}
              disabled={busy}
              onChange={(e) => toggle(e.target.checked)}
            />
            {l("sync.enable", { remote })}
          </label>
        </p>
        : <p>{l("sync.no-remote")}</p>
    }
    {status.enabled && <p className="sync-state">
      {describeSyncStatus(status).label}
      {status.lastSyncedAt !== null && status.state !== "error"
        ? " · " + l("sync.last-synced", {
          time: new Date(status.lastSyncedAt).toLocaleString(),
        })
        : null}
    </p>}
    {status.enabled && status.error && <p className="error">
      {status.error.message}
    </p>}
    {refusal && <p className="error">
      {l("sync.enable-failed", { message: refusal })}
    </p>}
    {status.enabled && <p>
      <button
        type="button"
        className="default-button dialog-box-button"
        disabled={status.state === "syncing"}
        onClick={() => void syncNow()}
      >
        {l("sync.sync-now")}
      </button>
    </p>}
  </section>;
};

export default AutoSyncSetting;
