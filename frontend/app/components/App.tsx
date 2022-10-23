import React, { useState } from "react";
import ConfirmationServiceProvider from "./ConfirmationServiceProvider";
import { DatabaseMode } from "../enum/DatabaseMode";
import DatabaseProvider from "../types/DatabaseProvider";
import UnsavedChangesContext from "../contexts/UnsavedChangesContext";
import AppMenuContext from "../contexts/AppMenuContext";
import DialogServiceProvider from "./DialogServiceProvider";
import DatabaseContext from "../contexts/DatabaseControlContext";
import AppRouter from "./AppRouter";
import useWarnBeforeUnload from "../hooks/useWarnBeforeUnload";

interface AppProps {
  localDatabaseProvider: DatabaseProvider,
  serverDatabaseProvider: DatabaseProvider,
}


const App = ({
  localDatabaseProvider,
  serverDatabaseProvider,
}: AppProps) => {
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
  const [isAppMenuOpen, setIsAppMenuOpen] = useState<boolean>(false);

  const appMenuControl = {
    isAppMenuOpen,
    setIsAppMenuOpen,
    toggleAppMenu: () => setIsAppMenuOpen(!isAppMenuOpen),
  };

  const [databaseMode, setDatabaseMode]
    = useState<DatabaseMode>(DatabaseMode.NONE);

  const databaseProvider: DatabaseProvider | null
    = databaseMode === DatabaseMode.LOCAL
      ? localDatabaseProvider
      : (
        databaseMode === DatabaseMode.SERVER
          ? serverDatabaseProvider
          : null
      );

  const databaseControl = {
    databaseProvider,
    databaseMode,
    setDatabaseMode,
    serverDatabaseProvider,
    localDatabaseProvider,
  };

  useWarnBeforeUnload(unsavedChanges);

  return <DatabaseContext.Provider value={databaseControl}>
    <ConfirmationServiceProvider>
      <UnsavedChangesContext.Provider
        value={[unsavedChanges, setUnsavedChanges]}
      >
        <AppMenuContext.Provider value={appMenuControl}>
          <DialogServiceProvider
            databaseProvider={databaseProvider}
          >
            <AppRouter />
          </DialogServiceProvider>
        </AppMenuContext.Provider>
      </UnsavedChangesContext.Provider>
    </ConfirmationServiceProvider>
  </DatabaseContext.Provider>;
};

export default App;
