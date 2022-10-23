import { useState } from "react";
import { GraphId } from "../../../lib/notes/interfaces/GraphId";
import GraphStats from "../../../lib/notes/interfaces/GraphStats";
import DatabaseProvider from "../types/DatabaseProvider";

// hook for retrieving graph stats for the application header
// refreshes only when manually invoked
export default (
  databaseProvider: DatabaseProvider,
  graphId: GraphId,
): [GraphStats | null, () => Promise<void>] => {
  const [headerStats, setHeaderStats] = useState<GraphStats | null>(null);

  const refreshHeaderStats = async (): Promise<void> => {
    try {
      const stats = await databaseProvider.getStats(
        graphId,
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
