import { useEffect } from "react";

interface KeyboardShortCutHandlers {
  onSave?: () => void,
  onCmdDot?: () => void,
  onCmdB?: () => void,
}

export default (handlers: KeyboardShortCutHandlers): void => {
  const handleKeydown = (e) => {
    if (
      handlers.onSave
      // @ts-ignore
      && (navigator.userAgentData.platform === "macOS" ? e.metaKey : e.ctrlKey)
      && e.key === "s"
    ) {
      handlers.onSave();
      e.preventDefault();
    }

    if (
      handlers.onCmdDot
      // @ts-ignore
      && (navigator.userAgentData.platform === "macOS" ? e.metaKey : e.ctrlKey)
      && e.key === "."
    ) {
      handlers.onCmdDot();
      e.preventDefault();
    }

    if (
      handlers.onCmdB
      // @ts-ignore
      && (navigator.userAgentData.platform === "macOS" ? e.metaKey : e.ctrlKey)
      && e.key === "b"
    ) {
      handlers.onCmdB();
      e.preventDefault();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeydown);

    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, [handleKeydown, handlers]);
};
