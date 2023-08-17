import NotesProviderContext from "../contexts/NotesProviderContext";
import {
  getNotesProvider,
  isInitialized,
} from "../lib/LocalDataStorage";
import useGraphAccessCheck from "../hooks/useGraphAccessCheck";
import BusyView from "./BusyView";


const NoteAccessProvider = ({
  children,
}: React.PropsWithChildren) => {
  useGraphAccessCheck();

  if (!isInitialized()) {
    return <BusyView />;
  }

  return <NotesProviderContext.Provider
    value={getNotesProvider()}
  >
    {children}
  </NotesProviderContext.Provider>;
};


export default NoteAccessProvider;
