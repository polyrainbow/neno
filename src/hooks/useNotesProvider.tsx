import { useContext } from "react";
import NotesProviderContext from "../contexts/NotesProviderContext";
import NotesProviderProxy from "../lib/notes-worker/NotesProviderProxy";

export const useNotesProvider = (): NotesProviderProxy => {
  const notesProviderContext = useContext(NotesProviderContext);
  if (!notesProviderContext) {
    throw new Error("NotesProviderContext is not initialized");
  }
  return notesProviderContext;
};

export default useNotesProvider;
