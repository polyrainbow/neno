import { useEffect, useRef, useCallback } from "react";
import scriptWorkerUrl from "../lib/script-worker/index.js?worker&url";
import {
  getNotesWorkerPort,
} from "../lib/LocalDataStorage";
import { Output } from "../lib/script-worker/outputTypes";


const useScriptExecutor = () => {
  const workerRef = useRef<Worker | null>(null);
  const isReadyRef = useRef(false);
  const pendingResolveRef
    = useRef<((output: Output) => void) | null>(null);

  useEffect(() => {
    const notesWorkerPort = getNotesWorkerPort();
    if (!notesWorkerPort) return;

    const worker = new Worker(scriptWorkerUrl, { type: "module" });
    workerRef.current = worker;

    const channel = new MessageChannel();
    notesWorkerPort.postMessage(
      { action: "addPort" },
      [channel.port1],
    );

    worker.postMessage(
      { action: "initialize" },
      [channel.port2],
    );

    worker.onmessage = (e) => {
      if (e.data.type === "INITIALIZED") {
        isReadyRef.current = true;
      } else if (e.data.type === "EVALUATION_COMPLETED") {
        if (pendingResolveRef.current) {
          pendingResolveRef.current(e.data.output);
          pendingResolveRef.current = null;
        }
      }
    };

    return () => {
      worker.terminate();
      workerRef.current = null;
      isReadyRef.current = false;
    };
  }, []);

  const executeScript = useCallback(
    (
      script: string,
      noteContent: string,
      noteSlug: string,
    ): Promise<Output> => {
      if (!workerRef.current || !isReadyRef.current) {
        return Promise.resolve(
          [{ type: "text", value: "Script executor not ready.\n" }],
        );
      }

      return new Promise((resolve) => {
        pendingResolveRef.current = resolve;
        workerRef.current!.postMessage({
          action: "evaluate",
          script,
          noteContent,
          noteSlug,
        });
      });
    },
    [],
  );

  return executeScript;
};


export default useScriptExecutor;
