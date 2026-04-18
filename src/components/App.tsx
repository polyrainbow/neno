import { useEffect, useState } from "react";
import ConfirmationServiceProvider from "./ConfirmationServiceProvider";
import UnsavedChangesContext from "../contexts/UnsavedChangesContext";
import GitEnabledContext from "../contexts/GitEnabledContext";
import AppRouter from "./AppRouter";
import useWarnBeforeUnload from "../hooks/useWarnBeforeUnload";
import { init, onChange } from "../lib/intl";
import useRunOnce from "../hooks/useRunOnce";
import useForceUpdate from "../hooks/useForceUpdate";
import {
  isGitEnabled,
  subscribeGitEnabled,
  unsubscribeGitEnabled,
} from "../lib/LocalDataStorage";

const App = () => {
  const [unsavedChanges, setUnsavedChanges] = useState<boolean>(false);
  const [intlModuleReady, setIntlModuleReady] = useState<boolean>(false);
  const [gitEnabled, setGitEnabled] = useState<boolean>(isGitEnabled());

  const forceUpdate = useForceUpdate();

  useWarnBeforeUnload(unsavedChanges);

  useRunOnce(async () => {
    await init();
    onChange(forceUpdate);
    setIntlModuleReady(true);
  });

  useEffect(() => {
    const onChange = () => setGitEnabled(isGitEnabled());
    subscribeGitEnabled(onChange);
    onChange();
    return () => unsubscribeGitEnabled(onChange);
  }, []);

  if (!intlModuleReady) return "";

  return <ConfirmationServiceProvider>
    <UnsavedChangesContext
      value={[unsavedChanges, setUnsavedChanges]}
    >
      <GitEnabledContext value={gitEnabled}>
        <AppRouter />
      </GitEnabledContext>
    </UnsavedChangesContext>
  </ConfirmationServiceProvider>;
};

export default App;
