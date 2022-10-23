import { createContext } from "react";
import DatabaseProvider from "../types/DatabaseProvider";

// https://stackoverflow.com/a/69735347/3890888
export default createContext<DatabaseProvider | null>(
  null,
);
