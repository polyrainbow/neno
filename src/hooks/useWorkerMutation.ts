import { useEffect } from "react";
import NotesProviderProxy, {
  WorkerEvent,
} from "../lib/notes-worker/NotesProviderProxy";

export default function useWorkerMutation(
  notesProvider: NotesProviderProxy | null,
  callback: () => void,
): void {
  useEffect(() => {
    if (!notesProvider) return;
    const listener = (event: WorkerEvent) => {
      if (event.event === "mutation") {
        callback();
      }
    };
    notesProvider.subscribe(listener);
    return () => notesProvider.unsubscribe(listener);
  }, [notesProvider, callback]);
}
