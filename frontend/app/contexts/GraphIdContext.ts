import { createContext } from "react";
import { GraphId } from "../../../lib/notes/interfaces/GraphId";

// https://stackoverflow.com/a/69735347/3890888
export default createContext<GraphId | null>(
  null,
);
