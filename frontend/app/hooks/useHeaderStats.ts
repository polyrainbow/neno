import { useState } from "react";
import GraphStats from "../../../lib/notes/interfaces/GraphStats";
import DatabaseProvider from "../interfaces/DatabaseProvider";

// hook for retrieving graph stats for the application header
// refreshes only when manually invoked
export default (
  databaseProvider: DatabaseProvider | null,
): [GraphStats | null, () => void] => {
  const [headerStats, setHeaderStats] = useState<GraphStats | null>(null);

  const refreshHeaderStats = () => {
    if (!databaseProvider) return;

    databaseProvider.getStats({
      includeMetadata: false,
      includeAnalysis: false,
    })
      .then((stats) => {
        setHeaderStats(stats);
      })
      .catch((e) => {
        // if credentials are invalid, it's fine, refeshNotesList takes care of
        // this. if there is another error, throw.
        if (e.message !== "INVALID_CREDENTIALS") {
          throw new Error(e);
        }
      });
  };

  return [headerStats, refreshHeaderStats];
};
