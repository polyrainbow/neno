import { useContext } from "react";
import DatabaseProviderContext from "../contexts/DatabaseProviderContext";
import DatabaseProvider from "../types/DatabaseProvider";

export const useDatabaseProvider = (): DatabaseProvider => {
  const databaseProviderContext = useContext(DatabaseProviderContext);
  if (!databaseProviderContext) {
    throw new Error(
      // eslint-disable-next-line max-len
      "No DatabaseProviderContext.Provider found when calling useDatabaseProvider.",
    );
  }
  return databaseProviderContext;
};

export default useDatabaseProvider;
