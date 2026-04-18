import { useContext } from "react";
import GitEnabledContext from "../contexts/GitEnabledContext";

const useGitEnabled = (): boolean => useContext(GitEnabledContext);

export default useGitEnabled;
