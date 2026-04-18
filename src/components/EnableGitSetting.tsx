import { useState } from "react";
import { l } from "../lib/intl";
import { enableGit } from "../lib/LocalDataStorage";

const EnableGitSetting = () => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onClick = async () => {
    setBusy(true);
    setError(null);
    try {
      await enableGit();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setBusy(false);
    }
  };

  return <section className="setting">
    <h2>{l("git-setup.heading")}</h2>
    <p>{l("git-setup.description")}</p>
    <p>
      <button
        type="button"
        onClick={onClick}
        disabled={busy}
        className="default-button dialog-box-button default-action"
      >
        {busy ? l("git-setup.enabling") : l("git-setup.enable")}
      </button>
    </p>
    {error && <p className="error">
      {l("git-setup.error", { message: error })}
    </p>}
  </section>;
};

export default EnableGitSetting;
