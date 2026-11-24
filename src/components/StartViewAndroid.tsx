import { useEffect, useState } from "react";
import { l } from "../lib/intl";
import { initializeNotesProvider } from "../lib/LocalDataStorage";
import { getBridge } from "../lib/electron/bridge";
import { goToGraphFromStart } from "../lib/startNavigation";
import { getNativePlugin, ProbeResult } from "../lib/android/nativePlugin";
import SshPublicKey from "./SshPublicKey";

/*
  The Android app's counterpart of StartViewLocal. There is no folder to
  pick: the graph lives in the app's private storage. It is shown on
  first launch only — once the graph exists, NoteAccessProvider opens it
  directly.

  Two ways in: an empty graph on this device, or a clone of a git
  repository over SSH, which also switches auto-sync on. On the desktop
  a remote is set up on the command line; on a phone, this is the way.
*/

type CloneStep
  = | { kind: "idle" }
  | { kind: "busy"; label: string }
  | { kind: "unknownHost"; host: string; fingerprint: string }
  | { kind: "problem"; message: string };

const describeProblem = (result: ProbeResult): string => {
  switch (result.state) {
  case "hostKeyChanged":
    return l("start.android.clone.host-key-changed", { host: result.host });
  case "auth":
    return l("start.android.clone.auth");
  case "offline":
    return l("start.android.clone.offline", { message: result.message });
  case "error":
    return l("start.android.clone.error", { message: result.message });
  default:
    return "";
  }
};

const openGraph = async (folderPath: string) => {
  await initializeNotesProvider(folderPath);
  goToGraphFromStart();
};

const CloneForm = ({ onBack }: { onBack: () => void }) => {
  const [url, setUrl] = useState("");
  const [step, setStep] = useState<CloneStep>({ kind: "idle" });
  const plugin = getNativePlugin();

  useEffect(() => {
    const handle = plugin.addListener("cloneProgress", (progress) => {
      const amount = progress.total > 0
        ? ` ${Math.round(100 * progress.done / progress.total)} %`
        : "";
      setStep({
        kind: "busy",
        label: l("start.android.clone.cloning", {
          task: progress.task + amount,
        }),
      });
    });
    return () => {
      void handle.then((h) => h.remove());
    };
  }, [plugin]);

  const connect = async () => {
    setStep({ kind: "busy", label: l("start.android.clone.connect") + "…" });
    try {
      const result = await plugin.probeRemote({ url });
      if (result.state === "unknownHost") {
        setStep({ kind: "unknownHost", ...result });
        return;
      }
      if (result.state !== "ok") {
        setStep({ kind: "problem", message: describeProblem(result) });
        return;
      }
      setStep({
        kind: "busy",
        label: l("start.android.clone.cloning", { task: "" }),
      });
      const { path } = await plugin.cloneGraph({ url });
      await openGraph(path);
    } catch (e) {
      setStep({
        kind: "problem",
        message: l("start.android.clone.error", {
          message: e instanceof Error ? e.message : String(e),
        }),
      });
    }
  };

  const trust = async (fingerprint: string) => {
    try {
      await plugin.trustHost({ url, fingerprint });
      await connect();
    } catch (e) {
      setStep({
        kind: "problem",
        message: e instanceof Error ? e.message : String(e),
      });
    }
  };

  const busy = step.kind === "busy";

  return <>
    <p>{l("start.android.clone.explainer")}</p>
    <SshPublicKey />
    <p>
      <label>
        {l("start.android.clone.url")}
        <input
          type="text"
          id="clone-url-input"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          value={url}
          disabled={busy}
          onChange={(e) => {
            setUrl(e.target.value);
            setStep({ kind: "idle" });
          }}
        />
      </label>
    </p>
    {step.kind === "busy" && <p id="clone-status">{step.label}</p>}
    {step.kind === "problem" && <p className="error-text" id="clone-status">
      {step.message}
    </p>}
    {step.kind === "unknownHost" && <>
      <p id="clone-status">
        {l("start.android.clone.unknown-host", {
          host: step.host,
          fingerprint: step.fingerprint,
        })}
      </p>
      <button
        type="button"
        className="default-button default-action"
        id="trust-host-button"
        onClick={() => void trust(step.fingerprint)}
      >
        {l("start.android.clone.trust")}
      </button>
    </>}
    {step.kind !== "unknownHost" && <button
      type="button"
      className="default-button default-action"
      id="clone-button"
      disabled={busy || url.trim().length === 0}
      onClick={() => void connect()}
    >
      {l("start.android.clone.connect")}
    </button>}
    <button
      type="button"
      className="default-button"
      disabled={busy}
      onClick={onBack}
    >
      {l("start.android.back")}
    </button>
  </>;
};

const StartViewAndroid = () => {
  const [hasError, setHasError] = useState(false);
  const [cloning, setCloning] = useState(false);

  if (cloning) {
    return <section id="start-view-local">
      <CloneForm onBack={() => setCloning(false)} />
    </section>;
  }

  return <section id="start-view-local">
    {
      hasError
        ? <p className="error-text">
          {l("start.local.error-accessing-folder")}
        </p>
        : ""
    }
    <p>{l("start.android.explainer")}</p>
    <button
      type="button"
      className="default-button default-action"
      id="open-graph-button"
      onClick={async () => {
        try {
          // Creates the folder on first use.
          const folderPath = await getBridge().pickFolder();
          if (folderPath === null) return;
          await openGraph(folderPath);
        } catch (_e) {
          setHasError(true);
        }
      }}
    >
      {l("start.android.open")}
    </button>
    <button
      type="button"
      className="default-button"
      id="start-clone-button"
      onClick={() => setCloning(true)}
    >
      {l("start.android.clone")}
    </button>
  </section>;
};

export default StartViewAndroid;
