import { useState } from "react";
import GraphStats from "../lib/notes/interfaces/GraphStats";
import NotesProvider from "../lib/notes";

// hook for retrieving graph stats for the application header
// refreshes only when manually invoked
export default (
  notesProvider: NotesProvider,
): [GraphStats | null, () => Promise<void>] => {
  const [headerStats, setHeaderStats] = useState<GraphStats | null>(null);

  const refreshHeaderStats = async (): Promise<void> => {
    try {
      const stats = await notesProvider.getStats(
        {
          includeMetadata: false,
          includeAnalysis: false,
        },
      );

      setHeaderStats(stats);
    } catch (e) {
      // if credentials are invalid, it's fine, refeshNotesList takes care of
      // this. if there is another error, throw.
      if (e instanceof Error && e.message !== "INVALID_CREDENTIALS") {
        throw new Error(e.message, { cause: e });
      }
    }
  };

  return [headerStats, refreshHeaderStats];
};
