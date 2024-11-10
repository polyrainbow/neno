import { useState } from "react";
import ConfirmationServiceProvider from "./ConfirmationServiceProvider";
import UnsavedChangesContext from "../contexts/UnsavedChangesContext";
import AppMenuContext from "../contexts/AppMenuContext";
import AppRouter from "./AppRouter";
import useWarnBeforeUnload from "../hooks/useWarnBeforeUnload";
import NotesProviderContext from "../contexts/NotesProviderContext";
import { getNotesProvider } from "../lib/LocalDataStorage";
import { init, onChange } from "../lib/intl";
import useRunOnce from "../hooks/useRunOnce";
import useForceUpdate from "../hooks/useForceUpdate";

const App = () => {
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
  const [intlModuleReady, setIntlModuleReady] = useState<boolean>(false);
  const [isAppMenuOpen, setIsAppMenuOpen] = useState<boolean>(false);

  const forceUpdate = useForceUpdate();

  const appMenuControl = {
    isAppMenuOpen,
    setIsAppMenuOpen,
    toggleAppMenu: () => setIsAppMenuOpen(!isAppMenuOpen),
  };
  const notesProvider = getNotesProvider();

  useWarnBeforeUnload(unsavedChanges);

  useRunOnce(async () => {
    await init();
    onChange(forceUpdate);
    setIntlModuleReady(true);
  });

  if (!intlModuleReady) return "";

  return <NotesProviderContext.Provider value={notesProvider}>
    <ConfirmationServiceProvider>
      <UnsavedChangesContext.Provider
        value={[unsavedChanges, setUnsavedChanges]}
      >
        <AppMenuContext.Provider value={appMenuControl}>
          <AppRouter />
        </AppMenuContext.Provider>
      </UnsavedChangesContext.Provider>
    </ConfirmationServiceProvider>
  </NotesProviderContext.Provider>;
};

export default App;
