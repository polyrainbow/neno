import { useContext } from "react";
import DatabaseControlContext from "../contexts/DatabaseControlContext";

const useDatabaseControl = () => {
  const databaseControlContext = useContext(DatabaseControlContext);
  if (!databaseControlContext) {
    throw new Error(
      // eslint-disable-next-line max-len
      "No DatabaseControlContext.Provider found when calling useDatabaseControl.",
    );
  }
  return databaseControlContext;
};

export default useDatabaseControl;
