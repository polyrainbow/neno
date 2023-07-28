import { useContext } from "react";
import NotesProviderContext from "../contexts/NotesProviderContext";
import NotesProvider from "../lib/notes";

export const useNotesProvider = (): NotesProvider => {
  const notesProviderContext = useContext(NotesProviderContext);
  if (!notesProviderContext) {
    throw new Error("NotesProviderContext is not initialized");
  }
  return notesProviderContext;
};

export default useNotesProvider;
