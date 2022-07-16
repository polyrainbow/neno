import { useEffect } from "react";

interface KeyboardShortCutHandlers {
  onSave?: () => void,
}

export default (handlers: KeyboardShortCutHandlers): void => {
  const handleKeydown = (e) => {
    if (
      handlers.onSave
      // navigator.platform is deprecated and should be replaced with
      // navigator.userAgentData.platform at some point
      && (window.navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)
      && e.key === "s"
    ) {
      handlers.onSave();
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
