import { useState } from "react";
import ConfirmationServiceProvider from "./ConfirmationServiceProvider";
import UnsavedChangesContext from "../contexts/UnsavedChangesContext";
import AppMenuContext from "../contexts/AppMenuContext";
import AppRouter from "./AppRouter";
import useWarnBeforeUnload from "../hooks/useWarnBeforeUnload";
import NotesProviderContext from "../contexts/NotesProviderContext";
import { getNotesProvider } from "../lib/LocalDataStorage";

const App = () => {
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
  const [isAppMenuOpen, setIsAppMenuOpen] = useState<boolean>(false);

  const appMenuControl = {
    isAppMenuOpen,
    setIsAppMenuOpen,
    toggleAppMenu: () => setIsAppMenuOpen(!isAppMenuOpen),
  };
  const notesProvider = getNotesProvider();

  useWarnBeforeUnload(unsavedChanges);

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
