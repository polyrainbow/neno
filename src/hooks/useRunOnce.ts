import { useEffect, useRef } from "react";

export default (fn: () => void): void => {
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      fn();
      hasRun.current = true;
    }
  }, []);
};
