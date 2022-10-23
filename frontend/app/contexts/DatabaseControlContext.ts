import React, { createContext } from "react";
import { DatabaseMode } from "../enum/DatabaseMode";
import DatabaseProvider from "../types/DatabaseProvider";
import LocalDatabaseProvider from "../types/LocalDatabaseProvider";

interface DatabaseControl {
  databaseModeRef: React.MutableRefObject<DatabaseMode>,
  serverDatabaseProvider: DatabaseProvider,
  localDatabaseProvider: LocalDatabaseProvider,
}

export default createContext<DatabaseControl | null>(null);
