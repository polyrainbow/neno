import { useEffect, useRef, useCallback } from "react";
import noteWorkerUrl from "../lib/note-worker/index.js?worker&url";
import {
  getActiveFolderHandle,
} from "../lib/LocalDataStorage";


const useScriptExecutor = () => {
  const workerRef = useRef<Worker | null>(null);
  const isReadyRef = useRef(false);
  const pendingResolveRef
    = useRef<((output: string) => void) | null>(null);

  useEffect(() => {
    const worker = new Worker(noteWorkerUrl, { type: "module" });
    workerRef.current = worker;

    worker.postMessage({
      action: "initialize",
      folderHandle: getActiveFolderHandle(),
    });

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
    ): Promise<string> => {
      if (!workerRef.current || !isReadyRef.current) {
        return Promise.resolve(
          "Script executor not ready.\n",
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
