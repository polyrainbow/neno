import { useState } from "react";
import GraphStats from "../lib/notes/types/GraphStats";
import NotesProviderProxy from "../lib/notes-worker/NotesProviderProxy";

// hook for retrieving graph stats for the application header
// refreshes only when manually invoked
export default (
  notesProvider: NotesProviderProxy,
): [GraphStats | null, () => Promise<void>] => {
  const [headerStats, setHeaderStats] = useState<GraphStats | null>(null);

  const refreshHeaderStats = async (): Promise<void> => {
    const stats = await notesProvider.getStats(
      {
        includeMetadata: false,
        includeAnalysis: false,
      },
    );

    setHeaderStats(stats);
  };

  return [headerStats, refreshHeaderStats];
};
