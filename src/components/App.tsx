import { useState } from "react";
import ConfirmationServiceProvider from "./ConfirmationServiceProvider";
import UnsavedChangesContext from "../contexts/UnsavedChangesContext";
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

  const forceUpdate = useForceUpdate();
  const notesProvider = getNotesProvider();

  useWarnBeforeUnload(unsavedChanges);

  useRunOnce(async () => {
    await init();
    onChange(forceUpdate);
    setIntlModuleReady(true);
  });

  if (!intlModuleReady) return "";

  return <NotesProviderContext value={notesProvider}>
    <ConfirmationServiceProvider>
      <UnsavedChangesContext
        value={[unsavedChanges, setUnsavedChanges]}
      >
        <AppRouter />
      </UnsavedChangesContext>
    </ConfirmationServiceProvider>
  </NotesProviderContext>;
};

export default App;
