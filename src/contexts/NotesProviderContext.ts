import { createContext } from "react";
import NotesProviderProxy from "../lib/notes-worker/NotesProviderProxy";

// https://stackoverflow.com/a/69735347/3890888
export default createContext<NotesProviderProxy | null>(
  null,
);
