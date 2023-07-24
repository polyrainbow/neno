import { createContext } from "react";
import NotesProvider from "../lib/notes";

// https://stackoverflow.com/a/69735347/3890888
export default createContext<NotesProvider | null>(
  null,
);
