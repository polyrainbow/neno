import { createContext } from "react";
import { DatabaseMode } from "../enum/DatabaseMode";
import DatabaseProvider from "../types/DatabaseProvider";

interface DatabaseControl {
  databaseProvider: DatabaseProvider | null,
  databaseMode: DatabaseMode,
  setDatabaseMode: (databaseMode: DatabaseMode) => void,
  serverDatabaseProvider: DatabaseProvider,
  localDatabaseProvider: DatabaseProvider,
}

export default createContext<DatabaseControl | null>(null);
