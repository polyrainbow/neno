import { useContext } from "react";
import NotesProviderContext from "../contexts/NotesProviderContext";
import NotesProvider from "../lib/notes";

export const useNotesProvider = (): NotesProvider => {
  const databaseProviderContext = useContext(NotesProviderContext);
  if (!databaseProviderContext) {
    throw new Error("NotesProviderContext is not initialized");
  }
  return databaseProviderContext;
};

export default useNotesProvider;
