import NotesProviderContext from "../contexts/NotesProviderContext";
import BusyIndicator from "./BusyIndicator";
import {
  getNotesProvider,
  isInitialized,
} from "../lib/LocalDataStorage";
import { l } from "../lib/intl";
import useGraphAccessCheck from "../hooks/useGraphAccessCheck";


const NoteAccessProvider = ({
  children,
}: React.PropsWithChildren) => {
  useGraphAccessCheck();

  if (!isInitialized()) {
    return <BusyIndicator height={80} alt={l("app.loading")} />;
  }

  return <NotesProviderContext.Provider
    value={getNotesProvider()}
  >
    {children}
  </NotesProviderContext.Provider>;
};


export default NoteAccessProvider;
