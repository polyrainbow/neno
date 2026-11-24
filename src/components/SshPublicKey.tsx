import { useEffect, useRef, useState } from "react";
import { l } from "../lib/intl";
import { getNativePlugin } from "../lib/android/nativePlugin";

/*
  This Android device's SSH public key, for the user to add to their git
  server. The key pair is made on first use; its private half never
  leaves the device.
*/
const SshPublicKey = () => {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [replaced, setReplaced] = useState(false);
  const [copied, setCopied] = useState(false);
  const textArea = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    void getNativePlugin().getPublicKey()
      .then(({ publicKey, replaced }) => {
        setPublicKey(publicKey);
        setReplaced(replaced);
      });
  }, []);

  const copy = async () => {
    if (!publicKey) return;
    try {
      await navigator.clipboard.writeText(publicKey);
      setCopied(true);
    } catch (_e) {
      // No clipboard access: select it, so the system menu can copy it.
      textArea.current?.select();
    }
  };

  return <>
    {replaced && <p className="error-text">{l("ssh-key.replaced")}</p>}
    <p>{l("ssh-key.explainer")}</p>
    <textarea
      ref={textArea}
      className="ssh-public-key"
      readOnly
      rows={3}
      value={publicKey ?? ""}
      onFocus={(e) => e.target.select()}
    />
    <p>
      <button
        type="button"
        className="default-button dialog-box-button"
        disabled={!publicKey}
        onClick={() => void copy()}
      >
        {copied ? l("ssh-key.copied") : l("ssh-key.copy")}
      </button>
    </p>
  </>;
};

export default SshPublicKey;
