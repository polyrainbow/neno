import DatabaseProvider from "./DatabaseProvider";

interface LocalDatabaseProvider extends DatabaseProvider {
  getFolderHandleName: () => Promise<string | null>,
  initializeDatabase: () => Promise<void>,
}


export default LocalDatabaseProvider;
