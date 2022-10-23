import { useContext } from "react";
import { GraphId } from "../../../lib/notes/interfaces/GraphId";
import GraphIdContext from "../contexts/GraphIdContext";

export const useGraphId = (): GraphId => {
  const graphIdContext = useContext(GraphIdContext);
  if (!graphIdContext) {
    throw new Error(
      "No GraphIdContext.Provider found when calling useGraphId.",
    );
  }
  return graphIdContext;
};

export default useGraphId;
